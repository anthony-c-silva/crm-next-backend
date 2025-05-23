import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';

/**
 * @swagger
 * /amostras/{idAmostra}:
 *   parameters:
 *     - in: path
 *       name: idAmostra
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: ID interno da amostra
 *   get:
 *     summary: Retorna uma amostra pelo ID interno
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
 *     summary: Atualiza uma amostra existente (não altera IdAmostra nem createdAt)
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
 *     summary: Remove uma amostra pelo ID interno
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
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { idAmostra } = req.query;
    const file = 'amostras.json';
    const amostras = await readJson(file);
    const idx = amostras.findIndex((a) => a.IdAmostra === idAmostra);

    if (idx === -1) return res.status(404).end();

    if (req.method === 'GET') {
        return res.status(200).json(amostras[idx]);
    }

    if (req.method === 'PUT') {
        // Só mescla campos, sem alterar IdAmostra nem createdAt
        amostras[idx] = {
            ...amostras[idx],
            ...req.body,
        };
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
