import nodemailer from "nodemailer";
import * as aws from '@aws-sdk/client-ses'

const ses = new aws.SES({
    apiVersion: "2012-10-17",
    region: "us-west-2",
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,

    }
    
})


const transporter = nodemailer.createTransport({
    SES: {ses, aws}
})


export function sendEmail(emailTemplate : string){
    

    transporter.sendMail(
        {
            from: 'contact@wwoodportfolio.awsapps.com',
            to: 'wwood98@outlook.com',
            subject: "Test Email",
            html: emailTemplate,
        },
        (error, info) => {
            if(error){
                console.error(error)
            } else{
                console.log('Email sent:', info.messageId)
            }
        }
    );

}