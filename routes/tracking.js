import express from "express";
import dotenv from "dotenv";
import updateSheet from "../utils/updateSheet.js";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { ip, ts, colo, loc } = req.body;
  const date = new Date(ts * 1000); // convert seconds to milliseconds
  const options = { timeZone: "Australia/Melbourne", hour12: true };
  const newDate = date.toLocaleString("en-AU", options);

  const response = await updateSheet(
    [[ip, newDate, colo, loc]],
    process.env.GOOGLE_VISITORS_SHEET_ID
  );

  res.send(response);
});

export default router;
