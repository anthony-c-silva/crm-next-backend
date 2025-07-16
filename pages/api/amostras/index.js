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
 * description: Dados inválidos ou código de amostra inválido/utilizado.
 * '404':
 * description: Designação não encontrada.
 * '409':
 * description: O código de amostra informado já foi utilizado.
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

        const amostras = await readJson(amostrasFile);
        const designacoes = await readJson(designacoesFile);

        // --- VALIDAÇÃO DO CÓDIGO DA AMOSTRA ---
        const designacao = designacoes.find(d => d.id === designacaoId);
        if (!designacao) {
            return res.status(404).json({ error: 'Designação associada não encontrada.' });
        }

        if (!designacao.codigosAmostra || !designacao.codigosAmostra.includes(codigo)) {
            return res.status(400).json({ error: `O código de amostra '${codigo}' não é válido para esta designação.` });
        }

        const isCodeUsed = amostras.some(a => a.designacaoId === designacaoId && a.codigo === codigo);
        if (isCodeUsed) {
            return res.status(409).json({ error: `O código de amostra '${codigo}' já foi utilizado.` });
        }
        // --- FIM DA VALIDAÇÃO ---

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

        amostras.push(novaAmostra);
        await writeJson(amostrasFile, amostras);

        // Atualiza status da designação se todas as amostras foram coletadas
        const designacaoIdx = designacoes.findIndex(d => d.id === designacaoId);
        const amostrasDaDesignacao = amostras.filter(a => a.designacaoId === designacaoId);
        if (amostrasDaDesignacao.length >= designacao.quantidadeAmostras) {
            designacoes[designacaoIdx].status = 'Coletada';
            await writeJson(designacoesFile, designacoes);
        }

        return res.status(201).json(novaAmostra);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
