import nodemailer from "nodemailer";
import config from "../config";
import ApiError from "../errors/ApiError";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.EMAIL.USER,
    pass: config.EMAIL.PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: config.EMAIL.USER,
      to,
      subject,
      html,
    });
    // console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw ApiError.internal("Email could not be sent");
  }
};
