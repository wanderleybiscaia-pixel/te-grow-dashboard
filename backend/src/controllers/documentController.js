const { asyncHandler } = require('../middleware/errorHandler');
const documentService = require('../services/documentService');
const { validateDocumentUpdate } = require('../middleware/validation');

class DocumentController {
  static getAll = asyncHandler(async (req, res) => {
    const filters = {};
    if (req.query.mimeType) filters.mimeType = req.query.mimeType;
    if (req.query.isPublished !== undefined) filters.isPublished = req.query.isPublished === 'true';
    if (req.query.tags) filters.tags = req.query.tags.split(',');

    const documents = await documentService.getAllDocuments(filters);

    res.json({
      success: true,
      count: documents.length,
      documents: documents.map(doc => ({
        id: doc.id,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
        fileSize: doc.fileSize,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        tags: doc.tags,
        isPublished: doc.isPublished
      }))
    });
  });

  static getById = asyncHandler(async (req, res) => {
    const document = await documentService.getDocument(req.params.id);

    res.json({
      success: true,
      document: {
        id: document.id,
        fileName: document.fileName,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        extractedData: document.extractedData,
        insights: document.insights,
        chartSuggestions: document.chartSuggestions,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
        tags: document.tags,
        isPublished: document.isPublished
      }
    });
  });

  static update = asyncHandler(async (req, res) => {
    const updatedDocument = await documentService.updateDocument(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: 'Documento atualizado com sucesso',
      document: {
        id: updatedDocument.id,
        fileName: updatedDocument.fileName,
        extractedData: updatedDocument.extractedData,
        insights: updatedDocument.insights,
        updatedAt: updatedDocument.updatedAt
      }
    });
  });

  static delete = asyncHandler(async (req, res) => {
    await documentService.deleteDocument(req.params.id);

    res.json({
      success: true,
      message: 'Documento deletado com sucesso'
    });
  });
}

module.exports = DocumentController;
