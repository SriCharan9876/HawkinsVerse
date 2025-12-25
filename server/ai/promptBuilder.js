export const buildPrompt = (systemPrompt, history, userMessage) => {
    const contents = [];

    contents.push({
        role: "user",
        parts: [{ text: "Always reply in short spoken dialogue only. Never write paragraphs, narration, or stories." }]
    });

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