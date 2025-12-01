import { greenBold, redBold, blueBold, yellowBold, logWithTime } from '../utils.js';

const BASE_URL = 'http://103.149.252.61:3005';

export async function autoTravel(props) {
    const { cookies, user } = props;

    if (!cookies) {
        logWithTime(redBold("Không nhận được cookie. Vui lòng kiểm tra thông tin tài khoản"));
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'vi,en;q=0.9,en-US;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0',
        'Cookie': cookies
    };

    async function performTravel() {
        try {
            // Gửi request start_travel
            const travelResp = await fetch(`${BASE_URL}/api/game`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ action: "start_travel", staminaCost: 0 })
            });

            if (!travelResp.ok) {
                logWithTime(redBold(`❌ Lỗi hành tẩu: ${travelResp.statusText}`));
                return;
            }

            const travelData = await travelResp.json();
            if (!travelData.success) {
                logWithTime(redBold(`❌ ${travelData.message || 'Lỗi hành tẩu'}`));
                return;
            }

            logWithTime(greenBold(`✅ Hành tẩu thành công cho user: ${user.username}`));

            // Kiểm tra nếu có event
            if (travelData.event) {
                const event = travelData.event;
                logWithTime(blueBold('=== [SỰ KIỆN BẮT ĐƯỢC] ==='));
                logWithTime(yellowBold(`Tiêu đề: ${event.title}`));
                logWithTime(yellowBold(`Mô tả: ${event.description}`));
                logWithTime(yellowBold(`Loại: ${event.type}`));
                logWithTime(yellowBold(`Cơ hội kích hoạt: ${event.triggerChance}`));
                logWithTime(yellowBold(`Yêu cầu cảnh giới: ${event.realmRequirement}`));

                // Log choices
                logWithTime(blueBold('Lựa chọn:'));
                event.choices.forEach((choice, index) => {
                    logWithTime(yellowBold(`  ${index + 1}. ${choice.text} (ID: ${choice.id})`));
                });

                // Auto chọn choice đầu tiên
                const firstChoice = event.choices[0];
                if (firstChoice) {
                    const choiceResp = await fetch(`${BASE_URL}/api/game`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            action: "chooseEventOption",
                            eventId: event.id,
                            choiceId: firstChoice.id
                        })
                    });

                    if (!choiceResp.ok) {
                        logWithTime(redBold(`❌ Lỗi chọn lựa: ${choiceResp.statusText}`));
                        return;
                    }

                    const choiceData = await choiceResp.json();
                    if (!choiceData.success) {
                        logWithTime(redBold(`❌ ${choiceData.message || 'Lỗi chọn lựa'}`));
                        return;
                    }

                    const outcome = choiceData.data.outcome;
                    logWithTime(greenBold('=== [KẾT QUẢ LỰA CHỌN] ==='));
                    logWithTime(yellowBold(`Mô tả kết quả: ${outcome.description}`));
                    logWithTime(blueBold('Phần thưởng:'));
                    Object.entries(outcome.rewards).forEach(([key, value]) => {
                        logWithTime(yellowBold(`  ${key}: ${value}`));
                    });
                }
            } else {
                logWithTime(yellowBold('Không có sự kiện nào trong lần hành tẩu này.'));
            }
        } catch (error) {
            logWithTime(redBold(`❌ Lỗi: ${error.message}`));
        }
    }

    // Chạy ngay lần đầu
    await performTravel();

    // Set interval: 1 phút (60000 ms) chạy lại
    setInterval(performTravel, 200);
}