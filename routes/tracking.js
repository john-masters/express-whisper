import express from "express";
import dotenv from "dotenv";
import updateSheet from "../utils/updateSheet.js";
import unixTimeConvert from "../utils/unixTimeConvert.js";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { ip, ts, colo, loc } = req.body;
  const newDate = unixTimeConvert(ts);

  const response = await updateSheet([[ip, newDate, colo, loc]], 1);

  res.send(response);
});

export default router;
