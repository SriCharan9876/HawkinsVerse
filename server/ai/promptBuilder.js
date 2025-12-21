export const buildPrompt = (characterPrompt, history, userMessage) => {
    return [
        {
            role: "system",
            content: characterPrompt
        },
        ...history.slice(-6),
        {
            role: "user",
            content: userMessage
        }
    ]
}