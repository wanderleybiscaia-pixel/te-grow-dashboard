const { OpenAI } = require('openai');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeDocument(content, documentType) {
    try {
      const prompt = `
Analise o seguinte conteúdo de documento (${documentType}) e extraia as principais informações estruturadas em JSON.
Retorne um objeto JSON com campos como: title, summary, keyPoints, entities, metrics, dates, values.

Conteúdo:
${content.substring(0, 3000)}...

Retorne APENAS um JSON válido, sem explicações adicionais.
`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise de documentos e extração de dados. Retorne sempre respostas em JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const extractedData = this.parseJsonResponse(response.choices[0].message.content);
      return extractedData;
    } catch (error) {
      console.error('Erro ao analisar com OpenAI:', error);
      throw new Error(`Erro na análise OpenAI: ${error.message}`);
    }
  }

  async generateInsights(data) {
    try {
      const prompt = `
Com base nos seguintes dados extraídos de um documento:
${JSON.stringify(data, null, 2)}

Gere insights principais, recomendações e análises em formato JSON estruturado.
Retorne um objeto com: insights (array), recommendations (array), analysis (string).

Retorne APENAS um JSON válido.
`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise de dados e geração de insights estratégicos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      });

      return this.parseJsonResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      throw error;
    }
  }

  async suggestCharts(data) {
    try {
      const prompt = `
Com base nos seguintes dados:
${JSON.stringify(data, null, 2)}

Sugerir os 3 tipos de gráficos MAIS APROPRIADOS para visualizar estes dados.
Retorne um JSON com array 'chartSuggestions' contendo: type, reason, fields.
Tipos disponíveis: bar, line, pie, doughnut, area, scatter, bubble, radar, box, histogram, funnel, heatmap.

Retorne APENAS um JSON válido.
`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em visualização de dados e design de dashboards.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return this.parseJsonResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('Erro ao sugerir gráficos:', error);
      throw error;
    }
  }

  parseJsonResponse(responseText) {
    try {
      // Tentar encontrar JSON no response
      const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { raw: responseText };
    } catch (error) {
      console.warn('Erro ao fazer parse JSON:', error);
      return { raw: responseText };
    }
  }
}

module.exports = new OpenAIService();
