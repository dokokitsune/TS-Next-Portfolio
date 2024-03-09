import nodemailer from 'nodemailer';
import emailTemplate from './emalTemplate';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: 'wwoodportfolio@gmail.com',
        pass: 'NApoleon101!'
    }
})


const mailOptions ={
    from: "wwoodportfolio@gmail.com",
    to: "stakin101@gmial.com",
    subject: "Contact Me Form Response"
    html: emailTemplate("weston Wood", ),
}
