const { v4: uuidv4 } = require('uuid');

class DocumentService {
  constructor() {
    // Simulação de banco de dados em memória
    // Em produção, usar MongoDB/PostgreSQL
    this.documents = new Map();
  }

  async createDocument(fileData, parsedContent, extractedData) {
    const id = uuidv4();
    const document = {
      id,
      fileName: fileData.originalname,
      fileSize: fileData.size,
      mimeType: fileData.mimetype,
      filePath: fileData.path,
      parsedContent,
      extractedData,
      insights: null,
      chartSuggestions: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      isPublished: false
    };

    this.documents.set(id, document);
    return document;
  }

  async getDocument(id) {
    const doc = this.documents.get(id);
    if (!doc) {
      throw new Error('Documento não encontrado');
    }
    return doc;
  }

  async getAllDocuments(filters = {}) {
    let documents = Array.from(this.documents.values());

    // Aplicar filtros
    if (filters.mimeType) {
      documents = documents.filter(d => d.mimeType === filters.mimeType);
    }
    if (filters.isPublished !== undefined) {
      documents = documents.filter(d => d.isPublished === filters.isPublished);
    }
    if (filters.tags && filters.tags.length > 0) {
      documents = documents.filter(d => 
        filters.tags.some(tag => d.tags.includes(tag))
      );
    }

    return documents.sort((a, b) => b.createdAt - a.createdAt);
  }

  async updateDocument(id, updates) {
    const doc = this.documents.get(id);
    if (!doc) {
      throw new Error('Documento não encontrado');
    }

    const allowedUpdates = ['title', 'description', 'tags', 'isPublished', 'extractedData', 'insights'];
    const updateData = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    const updatedDoc = {
      ...doc,
      ...updateData,
      updatedAt: new Date()
    };

    this.documents.set(id, updatedDoc);
    return updatedDoc;
  }

  async deleteDocument(id) {
    const doc = this.documents.get(id);
    if (!doc) {
      throw new Error('Documento não encontrado');
    }

    // Deletar arquivo
    const fs = require('fs').promises;
    try {
      await fs.unlink(doc.filePath);
    } catch (error) {
      console.warn('Erro ao deletar arquivo:', error);
    }

    this.documents.delete(id);
    return { success: true, id };
  }

  async addInsights(id, insights) {
    const doc = this.documents.get(id);
    if (!doc) {
      throw new Error('Documento não encontrado');
    }

    doc.insights = insights;
    doc.updatedAt = new Date();
    this.documents.set(id, doc);
    return doc;
  }

  async addChartSuggestions(id, suggestions) {
    const doc = this.documents.get(id);
    if (!doc) {
      throw new Error('Documento não encontrado');
    }

    doc.chartSuggestions = suggestions;
    doc.updatedAt = new Date();
    this.documents.set(id, doc);
    return doc;
  }
}

module.exports = new DocumentService();
