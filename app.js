import express from "express";
import cors from "cors";
import transcribeRouter from "./routes/transcribe.js";
import paymentRouter from "./routes/payment.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.use("/transcribe", transcribeRouter);
app.use("/create-payment-intent", paymentRouter);

export default app;