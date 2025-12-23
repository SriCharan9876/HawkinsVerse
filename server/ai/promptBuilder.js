export const buildPrompt = (systemPrompt, history, userMessage) => {
    const contents = [];

    // Combine system prompt into first user message
    contents.push({
        role: "user",
        parts: [{ text: systemPrompt }]
    });

    // Add chat history
    history.slice(-6).forEach(m => {
        contents.push({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
        });
    });

    // Add current user message
    contents.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    return contents;
}