import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

configDotenv("dotenv");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    secure: true, // use TLS
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const { email, subject, template, data } = options;

  // get the path to the mail template file
  const templatePath = path.resolve("./templates") + `/${template}`;

  // render the email template with EJS
  const html = await ejs.renderFile(templatePath, { data: data });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

export default sendMail;
