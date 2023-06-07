import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const newFileName = uuidv4() + path.extname(file.originalname);
    cb(null, newFileName);
  },
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
});

export const upload = multer({ storage });

export default upload;
