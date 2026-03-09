const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const generateExplanation = async (question, answer, apiKey) => {
    const prompt = `다음 문제와 정답을 바탕으로, 중학생 수준에서 이해하기 쉬운 50자 이내의 짧은 해설을 한국어로 작성해줘.
문제: ${question}
정답: ${answer}`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error("Gemini API Error:", err);
        return "해설을 생성할 수 없습니다.";
    }
};

export const checkSimilarity = async (studentAnswer, correctAnswer, apiKey) => {
    const prompt = `학생의 답변 '${studentAnswer}'이 정답 '${correctAnswer}'과 의미상 90% 이상 일치하는지 판단해줘. 
  일치하면 'Pass', 아니면 'Fail'로만 응답해줘.`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        const result = data.candidates[0].content.parts[0].text.trim();
        return result === 'Pass';
    } catch (err) {
        console.error("Gemini Similarity Error:", err);
        return studentAnswer.trim() === correctAnswer.trim();
    }
};
