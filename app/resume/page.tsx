"use client"
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Document, Page } from 'react-pdf'

import pdf from "./types.s"







export default function Resume() {

  const resumePDF = pdf("./Tech Resume.pdf")


  return (
    <div>
      <Document file={resumePDF}>
        <Page pageNumber={1} />

      </Document>
      
    </div>
  )
}
