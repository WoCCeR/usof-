import Config from "../configs.json" assert { type: "json" };
import nodemailer from "nodemailer";

class Mail {
  async sendActivationMail(to, link) {
    try {
      const transporter = nodemailer.createTransport({

        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "woccer24@gmail.com",
          pass: "zjgk jrrg unha psnx",
        },
      });

      await transporter.sendMail({
        from: "Setting for you",
        to: [to],
        subject: "Activation account USOF",
        text: "",
        html: `
                    <div>
                        <h1>Activation link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Mail();
