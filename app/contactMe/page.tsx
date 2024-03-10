"use client";
import React from "react";
import styles from "../home.module.css";
import { createEmailTemplate } from "../components/actions";

import { Form, Button, Row, Col } from "react-bootstrap";


export default function ContactMe() {
  return (
    <main>
      <Form action={createEmailTemplate} className={styles.formContainer}>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Your Name" name="yourName" />
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
