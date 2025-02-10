"use client"
import React from 'react'
import styles from '../home.module.css'



export default function Resume() {

	return (
		<div className={styles.pageContainer}>
			<iframe className={styles.page} src='https://wwood-next-portfolio.s3.us-west-2.amazonaws.com/Resumes/Tech+Resume.pdf' />
		</div>
	)
}
