import fs from "fs";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const dirPath = path.join(process.cwd(), "uploads");

// if uploads directory doesn't exist, create it
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const newFileName = uuidv4() + path.extname(file.originalname);
    cb(null, newFileName);
  },
  destination: function (req, file, cb) {
    cb(null, dirPath);
  },
});

export const upload = multer({ storage });

export default upload;
