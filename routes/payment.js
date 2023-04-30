import express from "express";
import createPaymentIntent from "../utils/stripe.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  console.log(`${filePath} was uploaded`);

  if (!filePath) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  }

  createPaymentIntent(filePath, res);
});

export default router;
