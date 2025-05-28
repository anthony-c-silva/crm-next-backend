// scripts/generate-swagger.js
const fs = require('fs')
const path = require('path')

// Importa sua configuração do swagger-jsdoc
const { swaggerSpec } = require('../utils/swagger')

const outDir = path.resolve(process.cwd(), 'public')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir)
}

const outPath = path.join(outDir, 'swagger.json')
fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8')
console.log(`✅ Swagger spec gerada em ${outPath}`)
