import express from "express";
import Character from "../models/character.js";

const router = express.Router();

/* GET ALL CHARACTERS */
router.get("/", async (req, res) => {
    const characters = await Character.find();
    res.json(characters);
});

export default router;
