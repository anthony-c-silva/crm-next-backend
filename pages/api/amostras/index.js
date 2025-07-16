import cors from '../../../utils/cors';
import { readJson, writeJson } from '../../../utils/jsonHandler';
import { v4 as uuidv4 } from 'uuid';

/**
 * @swagger
 * /amostras:
 * get:
 * summary: Retorna todas as amostras
 * tags: [Amostras]
 * responses:
 * '200':
 * description: Lista de objetos Amostra
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Amostra'
 * post:
 * summary: Cria uma nova amostra
 * tags: [Amostras]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AmostraInput'
 * responses:
 * '201':
 * description: Amostra criada com sucesso
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Amostra'
 * '400':
 * description: Dados inválidos ou faltando
 */
export default async function handler(req, res) {
    await cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const amostrasFile = 'amostras.json';
    const designacoesFile = 'designacoes.json';

    if (req.method === 'GET') {
        const amostras = await readJson(amostrasFile);
        return res.status(200).json(amostras);
    }

    if (req.method === 'POST') {
        const {
            designacaoId,
            codigo,
            clima,
            temperaturaAmostra,
            temperaturaAmbiente,
            pH,
            fotos,
            anotacoes
        } = req.body;

        if (!designacaoId || !codigo || !clima || temperaturaAmostra === undefined || temperaturaAmbiente === undefined || pH === undefined) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
        }

        const IdAmostra = uuidv4();
        const now = new Date();
        const offsetMs = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now.getTime() - offsetMs);
        const dataCadastro = localTime.toISOString();

        const novaAmostra = {
            IdAmostra,
            designacaoId,
            codigo,
            clima,
            temperaturaAmostra,
            temperaturaAmbiente,
            pH,
            fotos: fotos || [],
            anotacoes: anotacoes || '',
            dataCadastro,
        };

        const amostras = await readJson(amostrasFile);
        amostras.push(novaAmostra);
        await writeJson(amostrasFile, amostras);

        const designacoes = await readJson(designacoesFile);
        const designacaoIdx = designacoes.findIndex(d => d.id === designacaoId);

        if (designacaoIdx !== -1) {
            const designacao = designacoes[designacaoIdx];
            const amostrasDaDesignacao = amostras.filter(a => a.designacaoId === designacaoId);

            if (amostrasDaDesignacao.length >= designacao.quantidadeAmostras) {
                designacoes[designacaoIdx].status = 'Coletada';
                await writeJson(designacoesFile, designacoes);
            }
        }

        return res.status(201).json(novaAmostra);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
