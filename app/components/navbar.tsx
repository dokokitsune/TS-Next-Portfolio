"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../layout.module.css";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isActive, setIsActive] = useState("");
  const path = usePathname();

  useEffect(() => {
    setIsActive(path);
  }, [path]);

  console.log(path);
  return (
    <nav>
    <ul className={styles.navBar}>
      <li>
        <Link
          className={`${styles.LinkElements} ${
            isActive === "/" ? "active" : ""
          }`}
          href="/"
        >
          Home
        </Link>
      </li>
      <li>
        <Link className={styles.LinkElements} href="aboutMe/">
          About Me
        </Link>
      </li>
      <li>
        <Link className={styles.LinkElements} href="projects/">
          Projects
        </Link>
      </li>
      <li>
        <Link className={styles.LinkElements} href="contactMe/">
          Contact Me
        </Link>
      </li>
      <li>
        <Link className={styles.LinkElements} href="resume/">
          Resume
        </Link>
      </li>
    </ul>
    </nav>
  );
}
