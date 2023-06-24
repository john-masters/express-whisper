import express from "express";
import cors from "cors";
import transcribeRouter from "./routes/transcribe.js";
import paymentRouter from "./routes/payment.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.use((req, res, next) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Access-Control-Allow-Origin", "https://scribr.me");
  next();
});

app.use("/transcribe", transcribeRouter);
app.use("/create-payment-intent", paymentRouter);
app.use("/auth", authRouter);

export default app;
