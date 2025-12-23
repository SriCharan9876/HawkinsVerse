import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MODEL = "gemini-2.5-flash";
const response = await axios({
  method: "post",
  url: `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent`,
  headers: {
    "Content-Type": "application/json",
    "x-goog-api-key": process.env.GEMINI_API_KEY
  },
  data: {
    contents: [
      {
        role: "user",
        parts: [{ text: "Reply in one friendly sentence." }]
      }
    ]
  }
});

console.log(response.data.candidates[0].content.parts[0].text);
