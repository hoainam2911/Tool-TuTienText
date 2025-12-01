import { yellowBold, greenBold, redBold, logWithTime } from './utils.js';

const BASE_URL = 'http://103.149.252.61:3005';

export async function loginGetCookies(username, password) {
    logWithTime(yellowBold('=== [ĐĂNG NHẬP TÀI KHOẢN] ==='));

    if (!username || !password) {
        logWithTime(redBold('❌ Username hoặc mật khẩu không được để trống'));
        return null;
    }

    try {
        const resp = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Language': 'vi,en;q=0.9,en-US;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0'
            },
            body: JSON.stringify({ username, password })
        });

        if (!resp.ok) {
            logWithTime(redBold(`❌ Lỗi đăng nhập: ${resp.statusText}`));
            return null;
        }

        const cookies = resp.headers.get('set-cookie');
        if (!cookies) {
            logWithTime(redBold('⚠️ Không nhận được cookies.'));
            return null;
        }

        const data = await resp.json();
        if (!data.success) {
            logWithTime(redBold(`❌ ${data.message}`));
            return null;
        }

        logWithTime(greenBold(`👤 Nhân vật: ${data.user.characterName || 'Unknown'}`));

        return {
            cookies,
            user: data.user
        };
    } catch (err) {
        logWithTime(redBold(`❌ Lỗi: ${err.message}`));
        return null;
    }
}