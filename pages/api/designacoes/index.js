import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';
import { v4 as uuidv4 } from 'uuid';

/**
 * @swagger
 * /designacoes:
 * get:
 * summary: Retorna todas as designações
 * tags: [Designações]
 * responses:
 * '200':
 * description: Lista de objetos Designacao
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Designacao'
 * post:
 * summary: Cria uma nova designação com códigos de amostra manuais
 * tags: [Designações]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/DesignacaoInput'
 * responses:
 * '201':
 * description: Designação criada
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Designacao'
 * '400':
 * description: Dados inválidos ou faltando
 */
export default async function handler(req, res) {
    await cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const file = 'designacoes.json';
    const designacoes = await readJson(file);

    if (req.method === 'GET') {
        return res.status(200).json(designacoes);
    }

    if (req.method === 'POST') {
        // Campos esperados do corpo da requisição
        const {
            pontoColetaId,
            coletorId,
            codigosAmostra,
            instrucoes,
            dataColeta,
        } = req.body;

        // Validação dos campos obrigatórios
        if (
            !pontoColetaId ||
            !coletorId ||
            !instrucoes ||
            !dataColeta ||
            !Array.isArray(codigosAmostra) ||
            codigosAmostra.length === 0
        ) {
            return res
                .status(400)
                .json({
                    error: 'Campos obrigatórios faltando ou inválidos: pontoColetaId, coletorId, instrucoes, dataColeta e um array de codigosAmostra com pelo menos um código.',
                });
        }

        // Gera a data de criação automaticamente
        const now = new Date();
        const localOffsetMs = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now.getTime() - localOffsetMs);
        const dataCriacao = localTime.toISOString();

        // Calcula a quantidade de amostras com base no tamanho do array
        const quantidadeAmostras = codigosAmostra.length;

        const novaDesignacao = {
            id: uuidv4(),
            pontoColetaId,
            coletorId,
            dataColeta, // Novo campo para a data agendada da coleta
            quantidadeAmostras, // Campo agora é calculado
            codigosAmostra, // Array de códigos fornecido pelo usuário
            instrucoes,
            status: 'false',
            dataCriacao, // Campo automático
        };

        designacoes.push(novaDesignacao);
        await writeJson(file, designacoes);
        return res.status(201).json(novaDesignacao);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
