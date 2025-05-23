import { promises as fs } from 'fs';
import { join } from 'path';

export async function readJson(fileName) {
    const filePath = join(process.cwd(), 'data', fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}

export async function writeJson(fileName, data) {
    const filePath = join(process.cwd(), 'data', fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
