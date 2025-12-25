import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: "HawkinsVerse" ,
        to: email,
        subject: "Your OTP for HawkinsVerse",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error sending email:", error);
    }

};

export default sendEmail;
