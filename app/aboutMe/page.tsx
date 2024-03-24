import React from 'react'
import styles from '../home.module.css'
import { Container } from 'react-bootstrap'
import Image from 'next/image'


export default function AboutMe() {
  return (
    <Container className={styles.aboutMeBody}>
      <div className={styles.summary}>
        Hello there, my name is Weston Wood and I am a Junior at California State University, Los Angeles (CalState LA).
        I am currently a Web Officer, and recently elected to become Web Master, for the Association for Computing Machinery (ACM) club on campus.
        I also work as a IT Student Assistant for CalState LA. 
        My goal after college is to either become a cloud engineer.

      </div>
      <Image src="/aboutMe.jpg" width={500} height={664} alt=''/>
      
    </Container>
  )
}
