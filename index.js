import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { transcribeRouter } from "./routes/transcribe.js";
import { paymentRouter } from "./routes/payment.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.use("/transcribe", transcribeRouter);
app.use("/create-payment-intent", paymentRouter);

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
)