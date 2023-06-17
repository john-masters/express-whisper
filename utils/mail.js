import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail() {
  try {
    const data = await resend.emails.send({
      from: "support@scribr.me",
      to: "mastersjohnr@gmail.com",
      subject: "Hello World",
      html: "<strong>It works!</strong>",
    });
    return data;
  } catch (error) {
    return error;
  }
}
