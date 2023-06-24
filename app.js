import express from "express";
import cors from "cors";
import transcribeRouter from "./routes/transcribe.js";
import paymentRouter from "./routes/payment.js";
import authRouter from "./routes/auth.js";
import trackingRouter from "./routes/tracking.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.use("/transcribe", transcribeRouter);
app.use("/create-payment-intent", paymentRouter);
app.use("/auth", authRouter);
app.use("/tracking", trackingRouter);

export default app;
