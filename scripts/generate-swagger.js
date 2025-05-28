// scripts/generate-swagger.js
import fs from 'fs';
import path from 'path';
import { swaggerSpec } from '../utils/swagger.js';

const outPath = path.resolve(process.cwd(), 'public', 'swagger.json');
fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log(`✅ Swagger spec gerada em ${outPath}`);
