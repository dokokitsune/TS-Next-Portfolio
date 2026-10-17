import { Suspense } from "react";
import styles from "../home.module.css";
import SteamActivity from "./steamActivity";
import { experience } from "./experience";

const roleRefs = ["e3b9f14", "a8f4c21", "7d3e9b0", "4c19a6e"];

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" tabIndex={-1}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>A little background</p>
        <h2 id="about-title" className={styles.pageTitle}>About me</h2>
      </header>
      <div className={styles.aboutMeBody}>
        <section className={styles.surfaceCard} aria-labelledby="background-title">
          <h3 id="background-title" className={styles.sectionHeading}>Hi, I’m Weston.</h3>
          <div className={styles.summary}>
            <p>
              I am a DevOps Engineer at Apollo Global Management and a Computer Science
              graduate from California State University, Los Angeles (Cal State LA). I
              specialize in cloud infrastructure, CI/CD automation, and observability across
              AWS and Azure AKS using Terraform, OpenTofu, Ansible, and Datadog, and I hold
              the <u>AWS Certified Solutions Architect Associate</u> certification.
            </p>
            <p>
              Outside of work, I love tinkering and building reliable systems from the ground
              up. In my living room, I host a 4 node Kubernetes homelab cluster running on
              Talos Linux with Flux CD, Cilium, and Grafana, and manage my machines
              declaratively with NixOS.
            </p>
          </div>
        </section>
        <section className={styles.surfaceCard} aria-labelledby="experience-title">
          <h3 id="experience-title" className={styles.sectionHeading}>Work experience</h3>
          <ol className={styles.experienceList}>
            {experience.map((role, index) => (
              <li key={`${role.company}-${role.title}`} className={styles.experienceItem}>
                <article>
                  <header className={styles.experienceHeader}>
                    <div>
                      <div className={styles.gitLogMeta}>
                        <span className={styles.gitCommitHash} aria-hidden="true">
                          {roleRefs[index] ?? `c0ffee${index}`}
                        </span>
                        {index === 0 && (
                          <span className={styles.gitHeadRef} aria-hidden="true">
                            HEAD -&gt; main
                          </span>
                        )}
                      </div>
                      <h4 className={styles.experienceTitle}>{role.title}</h4>
                      <p className={styles.experienceCompany}>{role.company}</p>
                      <p className={styles.experienceLocation}>{role.location}</p>
                    </div>
                    <p className={styles.experiencePeriod}>{role.period}</p>
                  </header>
                  <ul className={styles.experienceHighlights}>
                    {role.highlights.slice(0, 2).map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  {!!role.skills?.length && (
                    <ul className={styles.repoTopics} aria-label={`${role.title} skills`}>
                      {role.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.surfaceCard} aria-labelledby="games-title">
          <h3 id="games-title" className={styles.sectionHeading}>Away from the terminal</h3>
          <p className={styles.sectionIntro}>My recently played games and achievements on Steam.</p>
          <Suspense fallback={<p className={styles.sectionIntro} role="status">Loading recent games…</p>}>
            <SteamActivity />
          </Suspense>
        </section>
      </div>
    </section>
  );
}
