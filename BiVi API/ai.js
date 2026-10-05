const Groq = require("groq-sdk");
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});


const groq = new Groq({ apiKey: process.env.groq1});


async function getGroqChatCompletion() {
    return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "A user had to write: 'She walked slowly through the quiet park while the evening sun painted the sky in shades of orange and gold A cool breeze moved across the trees and distant voices mixed with the soft sound of passing cars nearby She smiled and continued home feeling peaceful after a long day' The user wrote: 'She walket slowly throuhh the quiet park while teh evening sun painted the sky in shades of oranee and gofd A cool breeze movdd across the trees and distant voices mixed with the soft sounf of passing cars nearby She smilet and continued home feeling peaceful after a long dai' in 30 seconds. Give me raw wpm, normalized wpm and accuracy.",
      },
    ],
    model: "openai/gpt-oss-120b",
  });
}
      async function main() {
        const chatCompletion = await getGroqChatCompletion();
        // Print the completion returned by the LLM.
        console.log(chatCompletion.choices[0]?.message?.content || "");
      }

console.log(main())