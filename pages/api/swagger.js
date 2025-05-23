// pages/api/swagger.js
import { swaggerSpec } from '../../utils/swagger'

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).send(swaggerSpec)
}
