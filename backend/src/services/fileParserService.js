const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const XLSX = require('xlsx');
const xml2js = require('xml2js');
const mammoth = require('mammoth');

class FileParserService {
  static async parseFile(filePath, mimeType) {
    try {
      switch (mimeType) {
        case 'application/pdf':
          return await this.parsePDF(filePath);
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          return await this.parseExcel(filePath);
        case 'application/xml':
        case 'text/xml':
          return await this.parseXML(filePath);
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return await this.parseWord(filePath);
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          return await this.parsePowerPoint(filePath);
        default:
          throw new Error(`Tipo de arquivo não suportado: ${mimeType}`);
      }
    } catch (error) {
      throw new Error(`Erro ao parsear arquivo: ${error.message}`);
    }
  }

  static async parsePDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    return {
      text: data.text,
      pages: data.numpages,
      metadata: data.metadata,
      format: 'pdf'
    };
  }

  static async parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheets = {};
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet);
    });

    return {
      sheets,
      sheetNames: workbook.SheetNames,
      format: 'excel'
    };
  }

  static async parseXML(filePath) {
    const xmlData = await fs.readFile(filePath, 'utf-8');
    const parser = new xml2js.Parser({ explicitArray: false });
    const jsonData = await parser.parseStringPromise(xmlData);
    
    return {
      data: jsonData,
      raw: xmlData,
      format: 'xml'
    };
  }

  static async parseWord(filePath) {
    const { value: text } = await mammoth.extractRawText({ path: filePath });
    
    return {
      text,
      format: 'word'
    };
  }

  static async parsePowerPoint(filePath) {
    // PowerPoint parsing básico - para análise completa usar biblioteca como pptxparse
    // Este é um placeholder para estrutura futura
    return {
      text: 'Conteúdo PowerPoint detectado',
      format: 'powerpoint',
      note: 'Análise detalhada disponível na versão premium'
    };
  }
}

module.exports = FileParserService;
