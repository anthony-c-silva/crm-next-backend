import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';
import { v4 as uuidv4 } from 'uuid';

/**
 * @swagger
 * /amostras:
 *   get:
 *     summary: Retorna todas as amostras
 *     tags:
 *       - Amostras
 *     responses:
 *       200:
 *         description: Lista de objetos Amostra
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Amostra'
 *   post:
 *     summary: Cria uma nova amostra
 *     tags:
 *       - Amostras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AmostraInput'
 *     responses:
 *       201:
 *         description: Amostra criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Amostra'
 */
export default async function handler(req, res) {
    await cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const file = 'amostras.json';
    const amostras = await readJson(file);

    if (req.method === 'GET') {
        return res.status(200).json(amostras);
    }

    if (req.method === 'POST') {
        const { CodAmostra, IDPontoColeta } = req.body;

        // Gera o ID interno
        const IdAmostra = uuidv4();

        // Timestamp local
        const now = new Date();
        const offsetMs = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now.getTime() - offsetMs);
        const createdAt = localTime.toISOString().replace('Z', '+03:00');

        const nova = {
            IdAmostra,
            CodAmostra,
            IDPontoColeta,
            createdAt,
        };

        amostras.push(nova);
        await writeJson(file, amostras);
        return res.status(201).json(nova);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
