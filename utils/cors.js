// utils/cors.js
import Cors from 'cors';
import initMiddleware from './init-middleware';

// Permite qualquer origem (“*”), todos os métodos e headers
const cors = initMiddleware(
    Cors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
);

export default cors;
