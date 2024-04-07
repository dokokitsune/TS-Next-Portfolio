"use server";
import { sendEmail } from "../api/send/sendEmail";


export async function createEmailTemplate(formData: FormData){
  const rawFormData = {
    Name: formData.get("yourName"),
    Company: formData.get("yourComp"),
    Number: formData.get("yourNumber"),
    Email: formData.get("yourEmail"),
    Message: formData.get("yourMessage"),
  };

  const emailTemplate: string =
    `<h1>Form Response from ` +
    rawFormData.Company +
    `</h1> \
  <h4>Name: ` +
    rawFormData.Name +
    `<br> Phone Number: ` +
    rawFormData.Number +
    `<br> Email: ` +
    rawFormData.Email +
    `</h4> \
  <p>` +
    rawFormData.Message +
    `</p>`;
    

    sendEmail(emailTemplate)

   

}

