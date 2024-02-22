"use client"

import React from 'react'
import styles from './contactMe.module.css'
import { useForm } from 'react-hook-form'
import { sendEmail } from '@/utils/send-email'
import { Form } from 'react-bootstrap'

export type FormData = {
  name: string
  email: string
  message: string
}

export default function ContactMe() {
  const {register, handleSubmit} = useForm<FormData>()
  
  function onSubmit(data: FormData){
    sendEmail(data)
  }
  return (
    <main>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' placeholder='Your Name' />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' placeholder='Your Email' />
        </Form.Group>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control type='textarea' />
        </Form.Group>
        

      </Form>


    </main>
  )
}
