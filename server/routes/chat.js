import express from "express";
import axios from "axios";
import Chat from "../models/chat.js";
import Character from "../models/character.js";
import { buildPrompt } from "../ai/promptBuilder.js";

const router = express.Router();

router.post("/:characterId", async (req, res) => {
    const { userId, message } = req.body;
    const { characterId } = req.params;

    const character = await Character.findById(characterId);
    if (!character) return res.status(404).json({ message: "Character not found" });

    let chat = await Chat.findOne({ userId, characterId });
    if (!chat) {
        chat = await Chat.create({ userId, characterId });
    }

    const prompt = buildPrompt(character.systemPrompt, chat.messages, message);

    const respone = await axios.post(
        "http://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
        {
            content: prompt.map((p) => ({
                role: p.role,
                parts: [{ text: p.content }]
            }))
        }
    )

    const aiReply = response.data.candidates[0].content.parts[0].text;

    chat.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: aiReply }
    )

    await chat.save();
    res.json({ message: aiReply });
})

export default router;
