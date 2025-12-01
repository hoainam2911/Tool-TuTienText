import { readAccountsFromFile } from './utils.js';
import { loginGetCookies } from './login.js';
import { autoTravel } from './travel/travel.js';

// Lấy filename từ argument (ví dụ: node src/app.js accounts.txt)
const fileName = process.argv[2];

if (!fileName) {
    console.error("❌ No filename provided. Usage: node src/app.js <filename>");
    process.exit(1);
}

async function main() {
    const accounts = readAccountsFromFile(fileName);
    if (accounts.length === 0) {
        console.error("❌ No accounts found.");
        return;
    }

    for (const { username, password } of accounts) {
        const loginResult = await loginGetCookies(username, password);
        if (loginResult) {
            autoTravel(loginResult);
        }
    }
}

main();