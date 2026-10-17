import styles from "../home.module.css";
import GitHubActivity from "./githubActivity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareGithub } from "@fortawesome/free-brands-svg-icons";
import { Suspense } from "react";

export default function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-title" tabIndex={-1}>
      <header className={styles.pageHeaderRow}>
        <div>
          <p className={styles.eyebrow}>On GitHub</p>
          <h2 id="projects-title" className={styles.pageTitle}>Projects</h2>
          <p className={styles.pageIntro}>
            My repositories, experiments, and recent work on GitHub.
          </p>
        </div>
        <a className={styles.socialLink} href="https://github.com/dokokitsune" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faSquareGithub} aria-hidden="true" />
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </header>
      <section className={styles.surfaceCard} aria-labelledby="github-activity-title">
        <h3 id="github-activity-title" className={styles.sectionHeading}>Explore my repositories</h3>
        <p className={styles.sectionIntro}>Browse recent projects, explore the code, and see what’s changed.</p>
        <Suspense fallback={<p className={styles.sectionIntro} role="status">Loading recent projects…</p>}>
          <GitHubActivity />
        </Suspense>
      </section>
    </section>
  );
}
