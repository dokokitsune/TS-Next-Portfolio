"use client";

import { useEffect, useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import styles from "../layout.module.css";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact Me" },
];

export default function LayoutNavbar() {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let frame = 0;

    function updateActiveSection() {
      frame = 0;
      const sections = links.flatMap(link => {
        const element = document.getElementById(link.id);
        return element ? [{ id: link.id, element }] : [];
      });
      if (!sections.length) return;

      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 112;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.element.getBoundingClientRect().top <= offset + 1) current = section.id;
      }
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1].id;
      }
      setActiveSection(current);
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateActiveSection);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, []);

  return (
    <Navbar
      className={styles.navBar}
      aria-label="Main navigation"
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      variant="dark"
    >
      <div className={`${styles.navInner} d-flex flex-wrap align-items-center`}>
        <Navbar.Brand href="/#home" className={styles.brand} onClick={() => setExpanded(false)}>
          Weston J. Wood<span className="visually-hidden"> — Home</span>
        </Navbar.Brand>
        <Navbar.Toggle
          className={`${styles.menuToggle} ms-auto`}
          aria-controls="responsive-navbar-nav"
          aria-label="Toggle navigation"
          aria-expanded={expanded}
        >
          <FaBars aria-hidden="true" />
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav" className={styles.navElements}>
          <Nav className={styles.navLinks}>
            {links.map(item => (
              <Nav.Link
                key={item.id}
                href={`/#${item.id}`}
                className={styles.linkElement}
                active={activeSection === item.id}
                aria-current={activeSection === item.id ? "location" : undefined}
                onClick={() => setExpanded(false)}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
