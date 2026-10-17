"use client";
import React from "react";
import { ReactTyped } from "react-typed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../home.module.css";
import { faLinkedin, faSquareGithub } from "@fortawesome/free-brands-svg-icons";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";

export default function HomeHero() {
  return (
    <section id="home" aria-labelledby="home-title" tabIndex={-1} className={styles.homeContainer}>
      <p className={styles.eyebrow}>Cloud &amp; infrastructure</p>
      <h1 id="home-title" className={styles.name}>Weston J. Wood</h1>
      <div className={styles.typedRow}>
        <span className={styles.typedPrompt} aria-hidden="true">$</span>
        <ReactTyped
          className={styles.reactTyped}
          strings={[
            "DevOps Engineer",
            "Homelab Enthusiast",
            "AWS Solutions Architect Certified",
          ]}
          typeSpeed={40}
          backSpeed={50}
          cursorChar="█"
          loop
        />
      </div>
      <span className={styles.staticSubtitle}>
        <span className={styles.typedPrompt} aria-hidden="true">$ </span>
        DevOps Engineer · Homelab Enthusiast · AWS Solutions Architect Certified
      </span>
      <div className={styles.icons}>
        <a
          className={styles.socialLink}
          href="https://wwood-next-portfolio.s3.us-west-2.amazonaws.com/Resumes/Tech+Resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faFilePdf} aria-hidden="true" />
          Résumé <span aria-hidden="true">↗</span>
        </a>
        <a className={styles.socialLink} href="https://www.linkedin.com/in/weston-wood9802/" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <a className={styles.socialLink} href="https://github.com/dokokitsune" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faSquareGithub} aria-hidden="true" />
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
