import nodemailer from 'nodemailer';

import SendOTPTemplate from '../templates/sendOTP.template';
// import { render } from '@react-email/components';
import { render } from '@react-email/render';

class NodeMailerService {
  private transporter = nodemailer.createTransport({
    //   service: 'gmail',
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  public sendOTP = async (to: string, name: string, otp: number) => {
    const mailOptions = {
      from: {
        name: String(process.env.MAIL_USER),
        address: String(process.env.MAIL_EMAIL),
      },
      to,
      subject: 'CinemaCrate - Verify Your Account',
      html: render(SendOTPTemplate({ name, otp })),
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
    }
  };
}

export default new NodeMailerService();
