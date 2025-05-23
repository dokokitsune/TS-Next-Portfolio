"use client";
import React from "react";
import { ReactTyped } from "react-typed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./home.module.css";
import { faLinkedin, faSquareGithub } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  return (
    <main className={styles.homeContainer}>
      <h1 className={styles.name}>Weston J. Wood</h1>
      <ReactTyped
        className={styles.reactTyped}
        strings={[
          "Cal State LA Alumni",
          "Aspiring Cloud Engineer",
          "AWS Solutions Architect Certified",
        ]}
        typeSpeed={40}
        backSpeed={50}
        loop
      // startWhenVisible
      ></ReactTyped>
      <div className={styles.icons}>
        <FontAwesomeIcon
          onClick={() =>
            window.open("https://www.linkedin.com/in/weston-wood9802/")
          }
          icon={faLinkedin}
          size="3x"
          className={styles.iconLinkedin}
        />
        <FontAwesomeIcon
          onClick={() => window.open("https://github.com/dokokitsune")}
          icon={faSquareGithub}
          size="3x"
          className={styles.iconGithub}
        />
      </div>
    </main>
  );
}
