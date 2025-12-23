import express from "express";
import axios from "axios";
import Chat from "../models/chat.js";
import Character from "../models/character.js";
import { buildPrompt } from "../ai/promptBuilder.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get chat history for a specific character and logged-in user
router.get("/:characterId", authMiddleware, async (req, res) => {
    try {
        const { characterId } = req.params;
        const userId = req.user.id;

        const chat = await Chat.findOne({ userId, characterId });
        if (!chat) return res.json([]);

        res.json(chat.messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/:characterId", authMiddleware, async (req, res) => {
    const { message } = req.body;
    const { characterId } = req.params;
    const userId = req.user.id; // Get ID from token

    const character = await Character.findById(characterId);
    if (!character) return res.status(404).json({ message: "Character not found" });

    let chat = await Chat.findOne({ userId, characterId });
    if (!chat) {
        chat = await Chat.create({ userId, characterId });
    }

    const contents = buildPrompt(character.systemPrompt, chat.messages, message);

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`,
            {
                contents
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                }
            }
        );


        const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
            || "I'm sorry, I'm having trouble generating a response. This could be due to safety filters or usage limits. Please try again later.";

        chat.messages.push(
            { role: "user", content: message },
            { role: "assistant", content: aiReply }
        )

        await chat.save();
        res.json({ message: aiReply });
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Error communicating with AI service" });
    }
})

export default router;
