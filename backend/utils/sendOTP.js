// utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendOtpMail = async (to, otp) => {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to,
        subject: 'Your OTP for registration',
        text: `Your OTP is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
};
