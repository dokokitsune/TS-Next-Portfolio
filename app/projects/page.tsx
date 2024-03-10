"use client"
import React from 'react'
import styles from '../home.module.css'
import { ProjectCard } from './projectCard'

export interface tempProps{
  imgUrl : string;
  Title : string;
  Summary: string;
}

export default function Projects() {
   

  const tempProject : tempProps[] = [
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 1",
      Summary: "Brief Description"
    },
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 2",
      Summary: "Brief Description"
    },
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 3",
      Summary: "Brief Description"
    },
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 4",
      Summary: "Brief Description"
    },
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 5",
      Summary: "Brief Description"
    }
  ]





  return (
    <main className={styles.projectContainer}>
    <h1 style={{padding:"50px 0 50px 0" }}>My Projects</h1>
      <ProjectCard data={tempProject} />
    </main>
      

  )
}
