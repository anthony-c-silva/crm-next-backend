import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';

/**
 * @swagger
 * /pontos/{id}:
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID único do ponto de coleta
 * get:
 * summary: Retorna um ponto de coleta pelo ID
 * tags: [Pontos]
 * responses:
 * '200':
 * description: Objeto Ponto
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Ponto'
 * '404':
 * description: Ponto não encontrado
 * put:
 * summary: Atualiza um ponto de coleta existente
 * tags: [Pontos]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/PontoInput'
 * responses:
 * '200':
 * description: Ponto atualizado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Ponto'
 * '404':
 * description: Ponto não encontrado
 * delete:
 * summary: Remove um ponto de coleta pelo ID
 * tags: [Pontos]
 * responses:
 * '200':
 * description: Ponto removido
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Ponto'
 * '404':
 * description: Ponto não encontrado
 */
export default async function handler(req, res) {
    await cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    const file = 'pontosColeta.json';
    const pontos = await readJson(file);
    const idx = pontos.findIndex((p) => p.id === id);

    if (idx === -1) {
        return res.status(404).json({ error: 'Ponto de coleta não encontrado' });
    }

    if (req.method === 'GET') {
        return res.status(200).json(pontos[idx]);
    }

    if (req.method === 'PUT') {
        const { id: bodyId, dataCadastro, ...updateData } = req.body;
        pontos[idx] = {
            ...pontos[idx],
            ...updateData,
        };
        await writeJson(file, pontos);
        return res.status(200).json(pontos[idx]);
    }

    if (req.method === 'DELETE') {
        const [removido] = pontos.splice(idx, 1);
        await writeJson(file, pontos);
        return res.status(200).json(removido);
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
