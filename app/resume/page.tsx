"use client"
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import styles from '../home.module.css'





export default function Resume() {




  return (
    <div className={styles.pageContainer}>
      <iframe className={styles.page} src='/pdfs/Tech Resume.pdf' />
    </div>
  )
}
