import { swaggerSpec } from '../../../utils/swagger';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(swaggerSpec);
}
