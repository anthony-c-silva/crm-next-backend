const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CRM Microbiologia API',
            version: '1.0.0',
            description:
                'Documentação dos endpoints de Amostras, Pontos de Coleta e Designações',
        },
        servers: [
            {
                url: 'https://crm-next-backend-1nib.vercel.app/api',
                description: 'Servidor Vercel',
            },
            {
                url: 'http://localhost:3002/api',
                description: 'Servidor Local',
            },
        ],
        tags: [
            { name: 'Amostras', description: 'Operações com amostras' },
            { name: 'Pontos', description: 'Operações com pontos de coleta' },
            {
                name: 'Designações',
                description: 'Operações com designações de coleta',
            },
        ],
        components: {
            schemas: {
                // --- Schemas de Amostra e Ponto (mantidos) ---
                Amostra: {
                    type: 'object',
                    properties: {
                        IdAmostra: {
                            type: 'string',
                            format: 'uuid',
                            description:
                                'ID interno da amostra (gerado automaticamente)',
                        },
                        designacaoId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID da designação associada',
                        },
                        codigo: {
                            type: 'string',
                            description:
                                'Código da amostra, selecionado da lista de códigos disponíveis na designação.',
                        },
                        clima: {
                            type: 'string',
                            enum: [
                                'Ensolarado',
                                'Chuviscado',
                                'Chuvoso',
                                'Nublado',
                            ],
                            description:
                                'Condição climática no momento da coleta',
                        },
                        temperaturaAmostra: {
                            type: 'number',
                            format: 'float',
                            description:
                                'Temperatura da amostra em graus Celsius',
                        },
                        temperaturaAmbiente: {
                            type: 'number',
                            format: 'float',
                            description:
                                'Temperatura ambiente em graus Celsius',
                        },
                        pH: {
                            type: 'number',
                            format: 'float',
                            minimum: 0,
                            maximum: 14,
                            description: 'Nível de pH da amostra',
                        },
                        fotos: {
                            type: 'array',
                            items: { type: 'string', format: 'binary' },
                            description: 'Lista de fotos da amostra',
                        },
                        anotacoes: {
                            type: 'string',
                            description: 'Anotações adicionais',
                        },
                        dataCadastro: {
                            type: 'string',
                            format: 'date-time',
                            description:
                                'Data de cadastro da amostra (gerado automaticamente)',
                        },
                    },
                },
                AmostraInput: {
                    type: 'object',
                    required: [
                        'designacaoId',
                        'codigo',
                        'clima',
                        'temperaturaAmostra',
                        'temperaturaAmbiente',
                        'pH',
                    ],
                    properties: {
                        designacaoId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID da designação associada',
                        },
                        codigo: {
                            type: 'string',
                            description:
                                'Código da amostra, selecionado da lista de códigos disponíveis na designação.',
                        },
                        clima: {
                            type: 'string',
                            enum: [
                                'Ensolarado',
                                'Chuviscado',
                                'Chuvoso',
                                'Nublado',
                            ],
                            description:
                                'Condição climática no momento da coleta',
                        },
                        temperaturaAmostra: {
                            type: 'number',
                            format: 'float',
                            description:
                                'Temperatura da amostra em graus Celsius',
                        },
                        temperaturaAmbiente: {
                            type: 'number',
                            format: 'float',
                            description:
                                'Temperatura ambiente em graus Celsius',
                        },
                        pH: {
                            type: 'number',
                            format: 'float',
                            minimum: 0,
                            maximum: 14,
                            description: 'Nível de pH da amostra',
                        },
                        fotos: {
                            type: 'array',
                            items: { type: 'string', format: 'binary' },
                            description: 'Lista de fotos da amostra (opcional)',
                        },
                        anotacoes: {
                            type: 'string',
                            description: 'Anotações adicionais (opcional)',
                        },
                    },
                },
                Ponto: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description:
                                'ID único do ponto de coleta (gerado automaticamente)',
                        },
                        nome: {
                            type: 'string',
                            description:
                                'Nome de identificação do ponto de coleta',
                        },
                        endereco: {
                            type: 'string',
                            description: 'Endereço completo do ponto',
                        },
                        coordenadas: {
                            type: 'object',
                            properties: {
                                latitude: { type: 'number', format: 'float' },
                                longitude: { type: 'number', format: 'float' },
                            },
                        },
                        statusContaminacao: {
                            type: 'string',
                            description: 'Status de contaminação do ponto',
                            example: 'Livre',
                        },
                        dataCadastro: {
                            type: 'string',
                            format: 'date-time',
                            description:
                                'Data de cadastro do ponto (gerado automaticamente)',
                        },
                    },
                },
                PontoInput: {
                    type: 'object',
                    required: [
                        'nome',
                        'endereco',
                        'coordenadas',
                        'statusContaminacao',
                    ],
                    properties: {
                        nome: {
                            type: 'string',
                            description:
                                'Nome de identificação do ponto de coleta',
                        },
                        endereco: {
                            type: 'string',
                            description: 'Endereço completo do ponto',
                        },
                        coordenadas: {
                            type: 'object',
                            required: ['latitude', 'longitude'],
                            properties: {
                                latitude: { type: 'number', format: 'float' },
                                longitude: { type: 'number', format: 'float' },
                            },
                        },
                        statusContaminacao: {
                            type: 'string',
                            description: 'Status de contaminação do ponto',
                            example: 'Livre',
                        },
                    },
                },
                // --- Schemas de Designação ATUALIZADOS ---
                Designacao: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único da designação',
                        },
                        pontoColetaId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID do ponto de coleta associado',
                        },
                        coletorId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID do coletor responsável',
                        },
                        dataColeta: {
                            type: 'string',
                            format: 'date',
                            description:
                                'Data agendada para a coleta. Ex: 2024-12-25',
                        },
                        quantidadeAmostras: {
                            type: 'integer',
                            description:
                                'Quantidade de amostras a serem coletadas (calculado automaticamente)',
                        },
                        codigosAmostra: {
                            type: 'array',
                            items: { type: 'string' },
                            description:
                                'Códigos únicos definidos pelo usuário para cada amostra a ser coletada.',
                        },
                        instrucoes: {
                            type: 'string',
                            description: 'Instruções para a coleta',
                        },
                        status: {
                            type: 'string',
                            enum: ['Coletada', 'Não coletada'],
                            description: 'Status da designação',
                        },
                        dataCriacao: {
                            type: 'string',
                            format: 'date-time',
                            description:
                                'Data de criação da designação (gerado automaticamente)',
                        },
                    },
                },
                DesignacaoInput: {
                    type: 'object',
                    required: [
                        'pontoColetaId',
                        'coletorId',
                        'codigosAmostra',
                        'instrucoes',
                        'dataColeta',
                    ],
                    properties: {
                        pontoColetaId: { type: 'string', format: 'uuid' },
                        coletorId: { type: 'string', format: 'uuid' },
                        dataColeta: {
                            type: 'string',
                            format: 'date',
                            description:
                                'Data em que a coleta deve ser realizada. Ex: 2024-12-25',
                        },
                        codigosAmostra: {
                            type: 'array',
                            items: { type: 'string' },
                            description:
                                'Array com os códigos que serão usados para as amostras.',
                        },
                        instrucoes: { type: 'string' },
                    },
                },
                DesignacaoUpdateInput: {
                    type: 'object',
                    properties: {
                        pontoColetaId: { type: 'string', format: 'uuid' },
                        coletorId: { type: 'string', format: 'uuid' },
                        dataColeta: {
                            type: 'string',
                            format: 'date',
                            description:
                                'Nova data para a coleta. Ex: 2024-12-26',
                        },
                        codigosAmostra: {
                            type: 'array',
                            items: { type: 'string' },
                            description:
                                'Nova lista de códigos para as amostras.',
                        },
                        instrucoes: { type: 'string' },
                        status: {
                            type: 'string',
                            enum: ['Coletada', 'Não coletada'],
                        },
                    },
                },
            },
        },
    },
    apis: ['pages/api/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
