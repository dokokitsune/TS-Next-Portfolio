import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import styles from "../home.module.css";

export default function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" tabIndex={-1} className={styles.contactPage}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Get in touch</p>
        <h2 id="contact-title" className={styles.pageTitle}>Let’s connect.</h2>
      </header>
      <div className={`${styles.surfaceCard} ${styles.contactCard}`}>
        <div className={styles.contactCardMain}>
          <div className={styles.contactCopy}>
            <p className={styles.contactStatus}>
              <span className={styles.contactStatusDot} aria-hidden="true" />
              Available for Cloud, DevOps &amp; SRE roles
            </p>
            <h3 className={styles.contactHeading}>
              Have an opportunity or a project in mind?
            </h3>
            <p className={styles.contactDescription}>
              Send me a message on LinkedIn, whether it’s about an open engineering role, cloud architecture, or homelab setups.
            </p>
          </div>
          <a
            className={`${styles.socialLink} ${styles.contactButton}`}
            href="https://www.linkedin.com/in/weston-wood9802/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
            Message on LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
