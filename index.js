import express from "express"
import cors from "cors"
import { Configuration, OpenAIApi } from "openai"
import fs from "fs"
import dotenv from "dotenv"
import formidable from "formidable"
import multer from "multer"

dotenv.config()

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  destination: function (req, file, cb) {
    cb(null, './')
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
app.use(express.json({ limit: "25mb" }));

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

app.post("/", upload.single('file'), (req, res) => {
  res.send({ message: "Successful upload" })
  // const form = formidable({
  //   multiples: false
  // })

  // form.parse(req, async (err, fields, files) => {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send(err);
  //     return;
  //   }
  //   console.log(files);
  //   const fileStream = fs.createReadStream(files.file.path);
  //   try {
  //     const result = await openai.createTranscription(
  //       fileStream,
  //       "whisper-1",
  //       "",
  //       "json",
  //       "0",
  //       "en"
  //     )
  //     console.log(result)
  //     res.send(result)
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }

  // })

})
