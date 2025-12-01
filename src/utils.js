import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function yellowBold(...texts) {
    return `\x1b[1m\x1b[33m${texts.join(" ")}\x1b[0m`;
}

export function greenBold(...texts) {
    return `\x1b[1m\x1b[32m${texts.join(" ")}\x1b[0m`;
}

export function blueBold(...texts) {
    return `\x1b[1m\x1b[34m${texts.join(" ")}\x1b[0m`;
}

export function redBold(...texts) {
    return `\x1b[1m\x1b[31m${texts.join(" ")}\x1b[0m`;
}

export function logWithTime(content) {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${content}`);
}

export function readAccountsFromFile(fileName) {
    const filePath = path.join(__dirname, '..', fileName); // Đọc từ root dự án

    if (!fs.existsSync(filePath)) {
        console.error(`❌ ${fileName} không tồn tại`);
        return [];
    }

    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean);

    return lines.map(line => {
        const [username, password] = line.split(':').map(s => s.trim());
        return { username, password };
    });
}