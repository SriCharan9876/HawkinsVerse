import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    systemPrompt: String
});

export default mongoose.model("Character", characterSchema);