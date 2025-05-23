import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';
/**
 * @swagger
 * /amostras/{codAmostra}:
 *   parameters:
 *     - in: path
 *       name: codAmostra
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: Código único da amostra
 *   get:
 *     summary: Retorna uma amostra pelo ID
 *     tags:
 *       - Amostras
 *     responses:
 *       200:
 *         description: Objeto Amostra
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Amostra'
 *       404:
 *         description: Amostra não encontrada
 *   put:
 *     summary: Atualiza uma amostra existente
 *     tags:
 *       - Amostras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AmostraInput'
 *     responses:
 *       200:
 *         description: Amostra atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Amostra'
 *       404:
 *         description: Amostra não encontrada
 *   delete:
 *     summary: Remove uma amostra pelo ID
 *     tags:
 *       - Amostras
 *     responses:
 *       200:
 *         description: Amostra removida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Amostra'
 *       404:
 *         description: Amostra não encontrada
 */

export default async function handler(req, res) {
    await cors(req, res);
    const origin = req.headers.origin;
    if (
        ['http://localhost:3000', 'http://192.168.1.196:3000'].includes(origin)
    ) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { codAmostra } = req.query;
    const file = 'amostras.json';
    const amostras = await readJson(file);
    const idx = amostras.findIndex((a) => a.CodAmostra === codAmostra);

    if (idx === -1) return res.status(404).end();

    if (req.method === 'GET') {
        return res.status(200).json(amostras[idx]);
    }

    if (req.method === 'PUT') {
        amostras[idx] = { ...amostras[idx], ...req.body };
        await writeJson(file, amostras);
        return res.status(200).json(amostras[idx]);
    }

    if (req.method === 'DELETE') {
        const [removida] = amostras.splice(idx, 1);
        await writeJson(file, amostras);
        return res.status(200).json(removida);
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
