const fs = require('fs').promises;
const fsSync = require('fs');
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

  static async validatePDFFile(filePath) {
    try {
      const buffer = await fs.readFile(filePath);
      
      // Verifica se o arquivo começa com %PDF
      if (!buffer.toString('utf8', 0, 4).startsWith('%PDF')) {
        throw new Error('Arquivo não é um PDF válido - cabeçalho inválido');
      }
      
      // Verifica o tamanho mínimo de um PDF válido
      if (buffer.length < 100) {
        throw new Error('Arquivo PDF muito pequeno ou corrompido');
      }
      
      return buffer;
    } catch (error) {
      throw new Error(`Validação de PDF falhou: ${error.message}`);
    }
  }

  static async parsePDF(filePath) {
    try {
      // Valida o PDF antes de processar
      const dataBuffer = await this.validatePDFFile(filePath);
      
      // Tenta fazer parse com options de recuperação
      const options = {
        pagerender: null,
        max: 0, // 0 = sem limite
        disableCombineTextItems: true
      };
      
      try {
        const data = await pdfParse(dataBuffer, options);
        
        return {
          text: data.text,
          pages: data.numpages,
          metadata: data.metadata,
          format: 'pdf'
        };
      } catch (parseError) {
        // Se falhar, tenta com opções mais agressivas de recuperação
        console.warn('⚠️ Tentando recuperação de PDF corrompido...');
        
        // Extrai texto bruto ignorando XRef corrompido
        const text = dataBuffer.toString('utf8').match(/BT([\s\S]*?)ET/g)?.join('\n') || 
                     dataBuffer.toString('latin1').replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
        
        if (!text || text.trim().length === 0) {
          throw new Error('Não foi possível extrair texto do PDF - arquivo pode estar corrompido ou ser apenas imagens');
        }
        
        return {
          text: text.substring(0, 50000), // Limita a 50k caracteres
          pages: 0,
          metadata: { isRecovered: true },
          format: 'pdf',
          warning: 'PDF foi processado com recuperação de erro'
        };
      }
    } catch (error) {
      throw new Error(`Erro ao processar PDF: ${error.message}`);
    }
  }

  static async parseExcel(filePath) {
    try {
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
    } catch (error) {
      throw new Error(`Erro ao processar Excel: ${error.message}`);
    }
  }

  static async parseXML(filePath) {
    try {
      const xmlData = await fs.readFile(filePath, 'utf-8');
      const parser = new xml2js.Parser({ 
        explicitArray: false,
        strict: false // Menos rigoroso com XML malformado
      });
      const jsonData = await parser.parseStringPromise(xmlData);
      
      return {
        data: jsonData,
        raw: xmlData,
        format: 'xml'
      };
    } catch (error) {
      throw new Error(`Erro ao processar XML: ${error.message}`);
    }
  }

  static async parseWord(filePath) {
    try {
      const { value: text } = await mammoth.extractRawText({ path: filePath });
      
      return {
        text,
        format: 'word'
      };
    } catch (error) {
      throw new Error(`Erro ao processar Word: ${error.message}`);
    }
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
