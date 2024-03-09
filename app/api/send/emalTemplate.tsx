import React from "react";

interface emailProps {
  name: string;
  phoneNum: number;
  company: string;
  message: string;
  email: string;
}

export default function emailTemplate({name, phoneNum, company, message, email}: emailProps) {
  return (
    <>
      <body>
        <h1>Contact Me Form Response from {company}</h1>
        <h2>{name}, {phoneNum}, {email} </h2>
        <p>{message}</p>
    
      </body>
    </>
  );
}



