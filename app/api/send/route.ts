import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD,
        
    }
})


export function sendEmail(emailTemplate : string){
    var message = {
        from: process.env.EMAIL_USER,
        to: process.env.RECV_EMAIL,
        subject: "Portfolio Contact Response",
        html: emailTemplate,
    }

    transporter.sendMail(message);

}