import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';

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
 * /designacoes/{id}:
 * get:
 * summary: Retorna uma designação pelo ID
 * tags: [Designações]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID único da designação
 * responses:
 * '200':
 * description: Objeto Designacao
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Designacao'
 * '404':
 * description: Designação não encontrada
 * put:
 * summary: Atualiza uma designação existente
 * tags: [Designações]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID único da designação
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/DesignacaoUpdateInput'
 * responses:
 * '200':
 * description: Designação atualizada
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Designacao'
 * '404':
 * description: Designação não encontrada
 * delete:
 * summary: Remove uma designação pelo ID
 * tags: [Designações]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID único da designação
 * responses:
 * '200':
 * description: Designação removida
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Designacao'
 * '404':
 * description: Designação não encontrada
 */
export default async function handler(req, res) {
    await cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    const file = 'designacoes.json';
    const designacoes = await readJson(file);
    const idx = designacoes.findIndex((d) => d.id === id);

    if (idx === -1) {
        return res.status(404).json({ error: 'Designação não encontrada' });
    }

    if (req.method === 'GET') {
        return res.status(200).json(designacoes[idx]);
    }

    if (req.method === 'PUT') {
        const { id: bodyId, dataCriacao, codigosAmostra, ...updateData } = req.body;
        
        const originalDesignacao = designacoes[idx];

        // Se a quantidade de amostras for alterada, gera uma nova lista de códigos.
        // ATENÇÃO: Isso substitui os códigos antigos. Em um sistema real, seria preciso
        // verificar se algum código já foi usado antes de permitir a alteração.
        if (updateData.quantidadeAmostras && updateData.quantidadeAmostras !== originalDesignacao.quantidadeAmostras) {
            const newCodes = [];
            for (let i = 0; i < updateData.quantidadeAmostras; i++) {
                newCodes.push(generateSampleCode());
            }
            updateData.codigosAmostra = newCodes;
        }

        designacoes[idx] = {
            ...originalDesignacao,
            ...updateData,
        };
        await writeJson(file, designacoes);
        return res.status(200).json(designacoes[idx]);
    }

    if (req.method === 'DELETE') {
        const [removida] = designacoes.splice(idx, 1);
        await writeJson(file, designacoes);
        return res.status(200).json(removida);
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
