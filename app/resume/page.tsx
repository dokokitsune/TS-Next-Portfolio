"use client"
import React from 'react'
import styles from '../home.module.css'





export default function Resume() {

  return (
    <div className={styles.pageContainer}>
      <iframe className={styles.page} src='/pdfs/Tech Resume.pdf' />
    </div>
  )
}
