import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';
import { v4 as uuidv4 } from 'uuid';

/**
 * @swagger
 * /pontos:
 * get:
 * summary: Retorna todos os pontos de coleta
 * tags: [Pontos]
 * responses:
 * '200':
 * description: Lista de objetos Ponto
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Ponto'
 * post:
 * summary: Cria um novo ponto de coleta
 * tags: [Pontos]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/PontoInput'
 * responses:
 * '201':
 * description: Ponto de coleta criado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Ponto'
 * '400':
 * description: Dados inválidos ou faltando
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
        const { nome, endereco, coordenadas, statusContaminacao } = req.body;

        if (!nome || !endereco || !coordenadas || !statusContaminacao) {
            return res
                .status(400)
                .json({
                    error: 'Campos obrigatórios faltando: nome, endereco, coordenadas, statusContaminacao',
                });
        }

        const now = new Date();
        const localOffsetMs = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now.getTime() - localOffsetMs);
        const dataCadastro = localTime.toISOString();

        const novoPonto = {
            id: uuidv4(),
            nome,
            endereco,
            coordenadas,
            statusContaminacao,
            dataCadastro,
        };

        pontos.push(novoPonto);
        await writeJson(file, pontos);
        return res.status(201).json(novoPonto);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
