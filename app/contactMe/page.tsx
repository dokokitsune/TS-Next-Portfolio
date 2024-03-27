"use client";
import React, { FormEvent, useEffect } from "react";
import styles from "../home.module.css";
import { createEmailTemplate } from "../components/actions";

import { Form, Button, Row, Col, Alert } from "react-bootstrap";



export default function ContactMe() {


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      window.alert("Email Sent!")
      const formData = new FormData(e.currentTarget);
      if (await createEmailTemplate(formData)) {
        console.log("Email Sent!");
        window.alert("Email Sent!") 
      } else {
        <Alert variant="danger">Email Failed to Send</Alert>;
      }
      window.location.reload();
      
    }
    

  return (
    <main >
      
      <h2 className={styles.contactTitle}>Contact Me</h2>

      <Form onSubmit={handleSubmit}  className={styles.formContainer}>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Name</Form.Label>
            <Form.Control required type="text" placeholder="Your Name" name="yourName" />

          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your Company Name"
              name="yourComp"
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Your Phone Number"
              name="yourNumber"
              
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="Your Email"
              name="yourEmail"
            />
          </Form.Group>
        </Row>

        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            required
            placeholder="Your Message"
            name="yourMessage"
          />
        </Form.Group>

        <Button
          type="submit"
          style={{
            width: "100px",
            position: "relative",
            alignContent: "end",
          }}
          
          
        >
          Submit
        </Button>
      </Form>
    </main>
  );
}
