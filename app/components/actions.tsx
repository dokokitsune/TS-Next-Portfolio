"use server";
import { usePathname } from "next/navigation";
import { sendEmail } from "../api/send/route";

export async function createEmailTemplate(formData: FormData) {
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
  <h2>` +
    rawFormData.Name +
    `, ` +
    rawFormData.Number +
    `, ` +
    rawFormData.Email +
    `</h2> \
  <p>` +
    rawFormData.Message +
    `</p>`;
    sendEmail(emailTemplate);
}

