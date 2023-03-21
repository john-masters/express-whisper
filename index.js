import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const port = 8080;

app.use(cors());

app.use(express.json({ limit: "25mb" }));

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

app.post("/", async (req, res) => {
  const { type, file, format } = req.body;
  // change from binary

  // console.log(Buffer.from(file, "binary").toString("base64"))
  console.log("req body", req.body)
  res.send()

  // if (type === "translate") {
  //   await openai
  //     .createTranslation(
  //       // fs.createReadStream(file),
  //       "whisper-1", // model
  //       "", // prompt
  //       format,
  //       "0" // temperature
  //     )
  //     .then((response) => {
  //       res.send(response.data);
  //     })
  //     .catch((error) => {
  //       res.send(error);
  //     });
  // } else {
  //   try {
  //     const result = await openai
  //     .createTranscription(
  //       // fs.createReadStream(file),
  //       Buffer.from(file, "binary").toString("base64"),
  //       "whisper-1", // model
  //       "", // prompt
  //       format,
  //       "0", // temperature
  //       "en" // language (ISO-639-1 format)
  //     )
  //     console.log("result: ", result)
  //     res.send(result)
  //   }
  //   catch(err) {
  //     console.log("err: ", err.response.data)

  //   }
  // }
});
