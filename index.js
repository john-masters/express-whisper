import express from "express"
import cors from "cors"
import { Configuration, OpenAIApi } from "openai"
import fs from "fs"
import dotenv from "dotenv"
import multer from "multer"

dotenv.config()

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  destination: function (req, file, cb) {
    cb(null, './files')
  },
})
const upload = multer({ storage })


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const app = express()
const port = 8080

app.use(cors())
app.use(express.json({ limit: "25mb" }))

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

app.post("/", upload.single('file'), async (req, res) => {

  const filePath = req.file.path
  
  if (!filePath) {
    res.status(400).send({ message: "No file uploaded" })
    return
  }

  const fileStream = fs.createReadStream(filePath);
  try {
    const result = await openai.createTranscription(
      fileStream,
      "whisper-1",
      "",
      "json",
      "0",
      "en"
    )
    console.log("result: ", result.data.text)
    res.status(200).send({ text: result.data.text })

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(`${filePath} was deleted`)
    })
  }
  catch (error) {
    console.log("error: ", error)
  }

})
