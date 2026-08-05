const { asyncHandler } = require('../middleware/errorHandler');
const FileParserService = require('../services/fileParserService');
const openaiService = require('../services/openaiService');
const documentService = require('../services/documentService');

class UploadController {
  static upload = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo fornecido' });
    }

    console.log('📁 Arquivo recebido:', req.file.originalname);

    try {
      // Parse do arquivo
      const parsedContent = await FileParserService.parseFile(
        req.file.path,
        req.file.mimetype
      );

      console.log('✅ Arquivo parseado com sucesso');

      // Análise com OpenAI
      const extractedText = parsedContent.text || 
                           JSON.stringify(parsedContent.data) ||
                           JSON.stringify(parsedContent.sheets);

      console.log('🤖 Analisando com OpenAI...');
      const extractedData = await openaiService.analyzeDocument(
        extractedText,
        req.file.mimetype
      );

      console.log('💡 Gerando insights...');
      const insights = await openaiService.generateInsights(extractedData);

      console.log('📊 Sugerindo gráficos...');
      const chartSuggestions = await openaiService.suggestCharts(extractedData);

      // Criar documento
      const document = await documentService.createDocument(
        req.file,
        parsedContent,
        extractedData
      );

      await documentService.addInsights(document.id, insights);
      await documentService.addChartSuggestions(document.id, chartSuggestions);

      res.status(201).json({
        success: true,
        message: 'Arquivo uploadado e analisado com sucesso',
        document: {
          id: document.id,
          fileName: document.fileName,
          mimeType: document.mimeType,
          fileSize: document.fileSize,
          extractedData: document.extractedData,
          insights: document.insights,
          chartSuggestions: document.chartSuggestions,
          createdAt: document.createdAt
        }
      });
    } catch (error) {
      console.error('❌ Erro durante upload:', error);
      res.status(500).json({
        error: 'Erro ao processar arquivo',
        details: error.message
      });
    }
  });

  static batchUpload = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo fornecido' });
    }

    const results = [];
    const errors = [];

    for (const file of req.files) {
      try {
        const parsedContent = await FileParserService.parseFile(
          file.path,
          file.mimetype
        );

        const extractedText = parsedContent.text || 
                             JSON.stringify(parsedContent.data);

        const extractedData = await openaiService.analyzeDocument(
          extractedText,
          file.mimetype
        );

        const insights = await openaiService.generateInsights(extractedData);
        const chartSuggestions = await openaiService.suggestCharts(extractedData);

        const document = await documentService.createDocument(
          file,
          parsedContent,
          extractedData
        );

        await documentService.addInsights(document.id, insights);
        await documentService.addChartSuggestions(document.id, chartSuggestions);

        results.push({
          fileName: document.fileName,
          documentId: document.id,
          status: 'sucesso'
        });
      } catch (error) {
        errors.push({
          fileName: file.originalname,
          error: error.message
        });
      }
    }

    res.status(207).json({
      success: results.length > 0,
      processed: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  });
}

module.exports = UploadController;
