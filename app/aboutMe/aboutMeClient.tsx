"use client"
import React from 'react'
import styles from '../home.module.css'
import { Card } from 'react-bootstrap'
import { Game } from "../lib/steamInterfaces"
import SteamCard from './steamGames'
import { gitResponse } from '../lib/gitInterfaces'
import GitCard from './gitProjects'

type Games = Game[]
type Projects = gitResponse[]




interface AboutMeClientProps {
	initialGames: Games,
	initialProjects: Projects
}

export default function AboutMeClient({ initialGames, initialProjects }: AboutMeClientProps) {
	return (
		<div className={styles.aboutMeBody}>
			<Card style={{backgroundColor: "#151515"}}>
				<Card.Body >
				<Card.Title ><span className={styles.cardTitle}>About Me</span></Card.Title>
				<div className={styles.summary}>
				Hello there, my name is Weston Wood and I am a senior at California State University, Los Angeles (Cal State LA).
				I am currently the Web Master for the Association for Computing Machinery (ACM) club on campus. 
				I recently acquired the <u>AWS Certified Solutions Architect - Associate</u> certification.
				I also work as an IT Student Assistant where I service other departments with technology and monitor faculty computer labs.
				
				My career goal is to pursue a Cloud or Site Reliability Engineer position.
			</div>
				</Card.Body>
				<Card.Footer>
				<p className={styles.summary}> Make sure to check out my most recently commited projects and played games on Steam!</p>


				</Card.Footer>
				
			</Card>
			
			<Card style={{ backgroundColor: "#151515" }}>
				<Card.Body>
					<Card.Title style={{marginBottom: "25px"}} ><span className={styles.cardTitle}>Projects</span></Card.Title>

					<GitCard data={initialProjects} />
				</Card.Body>
			</Card>
			<Card style={{ backgroundColor: "#151515" }}>
				<Card.Body>
					<Card.Title style={{marginBottom: "25px"}}><span className={styles.cardTitle}>Games</span></Card.Title>
					<SteamCard data={initialGames}></SteamCard>
				</Card.Body>
			</Card>

		</div>
	)
}
