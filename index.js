import express from "express"
import cors from "cors"
import { Configuration, OpenAIApi } from "openai"
import fs from "fs"
import dotenv from "dotenv"
import multer from "multer"
import path from "path"
import Stripe from "stripe"
import ffprobe from "ffprobe"
import ffprobeStatic from "ffprobe-static"

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
const port = process.env.PORT || 8080

const stripe = Stripe('sk_test_51MpVLcJD5XPjP7WOKoNE08db9hWPDfPvGhwiZqzq9RMQYlYT0OYHp5suqIiemLclOhckoPAreUmuh6e8XFNBQiBj00eMZETM43')

app.use(cors())
app.use(express.json({ limit: "25mb" }))

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
)

app.post("/transcribe", upload.single('file'), async (req, res) => {
  const format = req.body.format
  const filePath = req.file.path
  
  if (!filePath) {
    res.status(400).send({ message: "No file uploaded" })
    return
  }

  const fileStream = fs.createReadStream(filePath);
  try {
    console.log("Transcription started")
    const result = await openai.createTranscription(
      fileStream,
      "whisper-1",
      "",
      format,
      "0",
      "en"
    )
    console.log("Transcription finished")

    const extension = () => {
      switch (format) {
        case "text":
          return ".txt"
        case "srt":
          return ".srt"
        case "vtt":
          return ".vtt"
      }
    }

    const fileName = path.basename(filePath, path.extname(filePath)) + extension()

    res.set({
      "Content-Type": "Application/octet-stream",
      "Content-Disposition": `attachment; filename=${fileName}`
    })
    res.send(Buffer.from(result.data))
  } catch (error) {
    console.log("error: ", error)
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(`${filePath} was deleted`)
    })
  }

})

app.post("/create-payment-intent", upload.single('file'), async (req, res) => {
  const { items } = req.body;
  const filePath = req.file.path
  
  if (!filePath) {
    res.status(400).send({ message: "No file uploaded" })
    return
  }

  try {
    const metadata = await ffprobe(filePath, { path: ffprobeStatic.path });
    const audioStream = metadata.streams.find((stream) => stream.codec_type === "audio");
    const pricePerSec = await stripe.prices.retrieve('price_1MrtVDJD5XPjP7WOs2qhF7wf')

    if (audioStream) {
      const duration = audioStream.duration / 60
      const centsPerMin = await stripe.prices.retrieve('price_1MrtVDJD5XPjP7WOs2qhF7wf')
      const pricePerMin = centsPerMin.unit_amount / 100
      const price = (duration * pricePerMin).toFixed(2)
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price,
        currency: "aud",
      })
  
      // Create a PaymentIntent with the order amount and currency
      res.send({
        clientSecret: paymentIntent.client_secret
      })
    }

  } catch (error) {
    console.error(`Error creating payment intent: ${error}`);
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(`${filePath} was deleted`)
    })
  }
})
