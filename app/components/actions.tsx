"use server";
import { Alert } from "react-bootstrap";
import { sendEmail } from "../api/send/sendEmail";
import { send } from "process";

export async function createEmailTemplate(formData: FormData): Promise<boolean>{
  const rawFormData = {
    Name: formData.get("yourName"),
    Company: formData.get("yourComp"),
    Number: formData.get("yourNumber"),
    Email: formData.get("yourEmail"),
    Message: formData.get("yourMessage"),
  };

  const emailTemplate: string =
    `<h1>Contact Me Form Response from ` +
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
    if(await sendEmail(emailTemplate)){
      return true;
    };
    return false;
}

