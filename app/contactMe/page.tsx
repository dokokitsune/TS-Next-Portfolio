"use client";
import React, { FormEvent, useEffect } from "react";
import styles from "../home.module.css";
import { createEmailTemplate } from "../components/actions";

import { Form, Button, Row, Col } from "react-bootstrap";

export default function ContactMe() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (await createEmailTemplate(formData)) {
      window.alert("Email Sent!");
      window.location.reload();
    } else {
      window.alert("Email Failed to send");
    }
  };

  return (
    <main>
      <h2 className={styles.contactTitle}>Contact Me</h2>

      <Form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.contactRows}>
          <Form.Group as={Col}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Your Name"
              name="yourName"
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your Company Name"
              name="yourComp"
            />
          </Form.Group>
        </div>

        <div className={styles.contactRows}>
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
        </div>

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
