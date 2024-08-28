import nodemailer from "nodemailer";

const sendEmail = async function (email, subject, message) {
    console.log("SMTP_USERNAME:", process.env.SMTP_USERNAME);
    console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD);

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL,
            to: email,
            subject: subject,
            html: message,
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;