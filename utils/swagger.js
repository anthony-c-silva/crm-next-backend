// utils/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CRM Microbiologia API',
            version: '1.0.0',
            description:
                'Documentação dos endpoints de Amostras e Pontos de Coleta',
        },
        servers: [
            { url: 'http://localhost:3002/api', description: 'Servidor local' },
        ],
        tags: [
            { name: 'Amostras', description: 'Operações com amostras' },
            { name: 'Pontos', description: 'Operações com pontos de coleta' },
        ],
        components: {
            schemas: {
                Amostra: {
                    type: 'object',
                    properties: {
                        CodAmostra: { type: 'string', format: 'uuid' },
                        IDPontoColeta: { type: 'string' },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data/hora de criação (fuso -03:00)',
                        },
                    },
                },
                AmostraInput: {
                    type: 'object',
                    required: ['IDPontoColeta'],
                    properties: {
                        IDPontoColeta: { type: 'string' },
                    },
                },
                Ponto: {
                    type: 'object',
                    properties: {
                        ID: { type: 'string', format: 'uuid' },
                        Nome: { type: 'string' },
                        cep: { type: 'string' },
                        Estado: { type: 'string' },
                        Cidade: { type: 'string' },
                        Bairro: { type: 'string' },
                        Rua: { type: 'string' },
                        Numero: { type: 'integer' },
                        Complemento: { type: 'string' },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp ISO de criação',
                        },
                    },
                },
                PontoInput: {
                    type: 'object',
                    required: [
                        'Nome',
                        'cep',
                        'Estado',
                        'Cidade',
                        'Bairro',
                        'Rua',
                        'Numero',
                    ],
                    properties: {
                        Nome: { type: 'string' },
                        cep: { type: 'string' },
                        Estado: { type: 'string' },
                        Cidade: { type: 'string' },
                        Bairro: { type: 'string' },
                        Rua: { type: 'string' },
                        Numero: { type: 'integer' },
                        Complemento: { type: 'string' },
                    },
                },
            },
        },
    },
    // Onde o swagger-jsdoc vai procurar comentários @swagger
    apis: ['./pages/api/**/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
