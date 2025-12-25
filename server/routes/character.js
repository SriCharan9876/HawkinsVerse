import express from "express";
import Character from "../models/character.js";

const router = express.Router();

/* GET ALL CHARACTERS */
router.get("/", async (req, res) => {
    const characters = await Character.find();
    res.json(characters);
});

/* GET CHARACTER BY ID */
router.get("/:id", async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(404).json({ message: "Character not found" });
        }
        res.json(character);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
