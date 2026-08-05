const { asyncHandler } = require('../middleware/errorHandler');
const documentService = require('../services/documentService');

class DashboardController {
  static getStats = asyncHandler(async (req, res) => {
    const documents = await documentService.getAllDocuments();

    const stats = {
      totalDocuments: documents.length,
      byType: {},
      totalSize: 0,
      recentUploads: documents.slice(0, 5)
    };

    documents.forEach(doc => {
      const type = doc.mimeType.split('/')[1];
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      stats.totalSize += doc.fileSize;
    });

    res.json({
      success: true,
      stats
    });
  });

  static getDashboardData = asyncHandler(async (req, res) => {
    const documents = await documentService.getAllDocuments();
    const { chartType } = req.query;

    const dashboardData = {
      overview: {
        totalDocuments: documents.length,
        processingDate: new Date(),
        lastUpdate: documents[0]?.updatedAt || null
      },
      documents: documents.map(doc => ({
        id: doc.id,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
        extractedData: doc.extractedData,
        insights: doc.insights,
        chartSuggestions: doc.chartSuggestions
      }))
    };

    res.json({
      success: true,
      data: dashboardData
    });
  });

  static getChartData = asyncHandler(async (req, res) => {
    const documents = await documentService.getAllDocuments();
    const { documentId, chartType } = req.query;

    if (documentId) {
      const doc = await documentService.getDocument(documentId);
      return res.json({
        success: true,
        chartData: {
          document: doc.fileName,
          data: doc.extractedData,
          suggestions: doc.chartSuggestions,
          chartType: chartType || 'auto'
        }
      });
    }

    // Agregação de dados de todos os documentos
    const chartData = this.aggregateChartData(documents, chartType);

    res.json({
      success: true,
      chartData
    });
  });

  static aggregateChartData(documents, chartType) {
    const typeCount = {};
    const sizeByType = {};
    const documentsList = [];

    documents.forEach(doc => {
      const type = doc.mimeType.split('/').pop();
      typeCount[type] = (typeCount[type] || 0) + 1;
      sizeByType[type] = (sizeByType[type] || 0) + doc.fileSize;
      documentsList.push({
        name: doc.fileName,
        size: doc.fileSize,
        type,
        date: doc.createdAt
      });
    });

    return {
      distribution: Object.entries(typeCount).map(([type, count]) => ({
        name: type,
        value: count
      })),
      sizeDistribution: Object.entries(sizeByType).map(([type, size]) => ({
        name: type,
        value: size
      })),
      timeline: documentsList.sort((a, b) => new Date(b.date) - new Date(a.date)),
      chartType: chartType || 'auto'
    };
  }
}

module.exports = DashboardController;
