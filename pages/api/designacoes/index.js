import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper function to generate a unique sample code in the format YYYYMMDD-XXXX.
 * @returns {string} A unique sample code.
 */
const generateSampleCode = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `${year}${month}${day}-${randomNum}`;
};

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
 * summary: Cria uma nova designação
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
        const { pontoColetaId, coletorId, quantidadeAmostras, instrucoes } = req.body;

        if (!pontoColetaId || !coletorId || !quantidadeAmostras || !instrucoes) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
        }

        const now = new Date();
        const localOffsetMs = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now.getTime() - localOffsetMs);
        const dataCriacao = localTime.toISOString();

        // Gera a lista de códigos de amostra
        const codigosAmostra = [];
        for (let i = 0; i < quantidadeAmostras; i++) {
            codigosAmostra.push(generateSampleCode());
        }

        const novaDesignacao = {
            id: uuidv4(),
            pontoColetaId,
            coletorId,
            quantidadeAmostras,
            codigosAmostra, // Novo campo com os códigos gerados
            instrucoes,
            status: 'Não coletada',
            dataCriacao,
        };

        designacoes.push(novaDesignacao);
        await writeJson(file, designacoes);
        return res.status(201).json(novaDesignacao);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
