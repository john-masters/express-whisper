import express from 'express'
import cors from 'cors'
import { Configuration, OpenAIApi } from "openai"
import fs from "fs"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const resp = await openai.createTranscription(
  fs.createReadStream("news.mp3"),
  "whisper-1"
);
console.log(resp)

const app = express()

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => res.send({info: resp}))

const port = 8080

app.listen(port, () => console.log(`Server running on port ${port}`))