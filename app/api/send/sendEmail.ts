
"use server";

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'




const ses = new SESClient({
	apiVersion: "2012-10-17",
	region: process.env.AWS_REGION!,
	credentials:
	{
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	}
	,


})


const sendEmailCommand = (bodyData: string) => {
	return new SendEmailCommand({
		Destination: {
			ToAddresses: ["stakin101@gmail.com"]
		},
		Message: {
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: bodyData
				}
			},
			Subject: {
				Charset: "UTF-8",
				Data: "Portfolio Form Response"
			}


		},
		Source: "contact@wwoodportfolio.awsapps.com"


	})
}

export async function sendEmail(emailTemplate: string): Promise<boolean> {

	ses.send(sendEmailCommand(emailTemplate), (err, data) => {
		if (err) {

			return false;

		} else {
			console.log(data);
			return true;


		}
	})

	return true;
}



