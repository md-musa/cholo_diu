import config from "../config";
import ApiError from "../errors/ApiError";
import axios from "axios";

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: config.BREVO.USER, name: "Cholo DIU App" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": config.BREVO.API_KEY || "",
          "Content-Type": "application/json",
        },
      },
    );

  } catch (error: any) {
    console.error("Failed to send email via Brevo API:", error.response?.data || error.message);
    throw ApiError.internal("Email could not be sent");
  }
};
