import { Resend } from 'resend';

import SendOTPTemplate from '../templates/sendOTP.template';
import { render } from '@react-email/render';

class ResendService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  public sendOTP = async (to: string, name: string, otp: number) => {
    try {
      const mailOptions = {
        from: process.env.MAIL_EMAIL || '',
        to,
        subject: 'CinemaCrate - Verify Your Account',
        html: render(SendOTPTemplate({ name, otp })),
      };

      const ans = await this.resend.emails.send(mailOptions);
      console.log(ans);
    } catch (error) {
      console.error(error);
    }
  };
}

export default new ResendService();
