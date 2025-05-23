import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';
import { v4 as uuidv4 } from 'uuid';

/**
 * @swagger
 * /pontos:
 *   get:
 *     summary: Retorna todos os pontos de coleta
 *     tags:
 *       - Pontos
 *     responses:
 *       200:
 *         description: Lista de objetos Ponto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ponto'
 *   post:
 *     summary: Cria um novo ponto de coleta
 *     tags:
 *       - Pontos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PontoInput'
 *     responses:
 *       201:
 *         description: Ponto criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ponto'
 */

export default async function handler(req, res) {
    await cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const file = 'pontosColeta.json';
    const pontos = await readJson(file);

    if (req.method === 'GET') {
        return res.status(200).json(pontos);
    }

    if (req.method === 'POST') {
        const { Nome, cep, Estado, Cidade, Bairro, Rua, Numero, Complemento } =
            req.body;

        const now = new Date();
        const localOffsetMs = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now.getTime() - localOffsetMs);
        const createdAt = localTime.toISOString().replace('Z', '+03:00');
        const novo = {
            ID: uuidv4(),
            Nome,
            cep,
            Estado,
            Cidade,
            Bairro,
            Rua,
            Numero,
            Complemento,
            createdAt,
        };

        pontos.push(novo);
        await writeJson(file, pontos);
        return res.status(201).json(novo);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
