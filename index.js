import express from 'express'
import cors from 'cors'
import { Configuration, OpenAIApi } from "openai"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const transcribe = await openai.createTranscription(
  fs.createReadStream("news.mp3"), // file
  "whisper-1", // model
  "Please transcribe: ", // prompt
  "text", //response_format
  "0", // temperature
  "en" // language (ISO-639-1 format)
)

const translate = await openai.createTranslation(
  fs.createReadStream("japanese.mp3"), // file
  "whisper-1", // model
  "Please transcribe: ", // prompt
  "text", //response_format
  "0" // temperature
)

const app = express()

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => res.send({info: transcribe.data}))

const port = 8080

app.listen(port, () => console.log(`Server running on port ${port}`))
