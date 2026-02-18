"use client";
import React from "react";
import styles from "../home.module.css";
import { Card } from "react-bootstrap";
import { Game } from "../lib/steamInterfaces";
import SteamCard from "./steamGames";
import { gitResponse } from "../lib/gitInterfaces";
import GitCard from "./gitProjects";

type Games = Game[];
type Projects = gitResponse[];

interface AboutMeClientProps {
  initialGames: Games;
  initialProjects: Projects;
}

export default function AboutMeClient({
  initialGames,
  initialProjects,
}: AboutMeClientProps) {
  return (
    <div className={styles.aboutMeBody}>
      <Card style={{ backgroundColor: "#151515" }}>
        <Card.Body>
          <Card.Title>
            <span className={styles.cardTitle}>About Me</span>
          </Card.Title>
          <div className={styles.summary}>
            Hello there, my name is Weston Wood and I am a 2025 Alumni of California State University,
            Los Angeles (Cal State LA) with a Bachelor&apos;s Degree in Computer Science. At home
            I host a 4 node Kubernetes cluster in my living room. I love to tinker and self-learn.
            I have taught myself Kubernetes, AWS, Infrustructure-as-Code with 
            Terraform/OpenTofu and was awarded with the <u>AWS Certified Solutions Architect - Associate</u> certification.
            Currently I work for Cal State LA assisting in the migration of their legacy database to a SaaS Faculty management tool. <br/><br/>  
            My career goal is to pursue a Cloud or Site Reliability Engineer
            position.
          </div>
        </Card.Body>
        <Card.Footer>
          <p className={styles.summary}>
            {" "}
            Make sure to check out my most recently committed projects and
            played games on Steam!
          </p>
        </Card.Footer>
      </Card>

      <Card style={{ backgroundColor: "#151515" }}>
        <Card.Body>
          <Card.Title style={{ marginBottom: "25px" }}>
            <span className={styles.cardTitle}>Projects</span>
          </Card.Title>

          <GitCard data={initialProjects} />
        </Card.Body>
      </Card>
      <Card style={{ backgroundColor: "#151515" }}>
        <Card.Body>
          <Card.Title style={{ marginBottom: "25px" }}>
            <span className={styles.cardTitle}>Games</span>
          </Card.Title>
          <SteamCard data={initialGames}></SteamCard>
        </Card.Body>
      </Card>
    </div>
  );
}
