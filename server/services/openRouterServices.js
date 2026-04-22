import axios from 'axios';


export const askAI = async (messages) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("No array message")
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions',
            {
                model: "openai/gpt-4o-mini",
                messages: messages
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        const content = response?.data?.choices?.[0]?.message?.content;
        if (!content || !content.trim()) {
            throw new Error("AI return empty result.")
        }
        return content
    } catch (error) {
        console.log("ask AI error: ", error)
        throw  new Error("OpenRouter API error")
    }
}