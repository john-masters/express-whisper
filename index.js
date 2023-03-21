import express from "express"
import cors from "cors"
import { Configuration, OpenAIApi } from "openai"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const app = express()
const port = 8080

app.use(cors())
app.use(express.json({ limit: "25mb" }));

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

app.post("/", async (req, res) => {
  const { file } = req.body

  // console.log(Buffer.from(file, "binary").toString("base64")) 
  console.log("req.body", req.body)
  res.send()
  try {
    const res = await openai.createTranscription(
      fs.createReadStream(file),
      // Buffer.from(file, "binary").toString("base64"),
      "whisper-1",
      "",
      "json",
      "0",
      "en"
    )
    res.send(res)
  }
  catch (error) {
    res.send(error)
  }

})
