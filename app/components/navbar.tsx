"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../layout.module.css";
import { usePathname } from "next/navigation";




export default function LayoutNavbar() {

  const path = usePathname();


  return (

    <nav className={styles.navSticky}>
      <ul className={styles.navBar}>
        <li>
          <Link className={`${path === '/' ? 'active' : ''} ${styles.LinkElements}`} href='/'>Home</Link>
        </li>
        <li>
          <Link className={`${path === '/aboutMe' ? 'active' : ''} ${styles.LinkElements}`} href="aboutMe/">
            About Me
          </Link>
        </li>
        <li>
          <Link className={`${path === '/projects' ? 'active' : ''} ${styles.LinkElements}`} href="projects/">
            Projects
          </Link>
        </li>
        <li>
          <Link className={`${path === '/contactMe' ? 'active' : ''} ${styles.LinkElements}`} href="contactMe/">
            Contact Me
          </Link>
        </li>
        <li>
          <Link className={`${path === '/resume' ? 'active' : ''} ${styles.LinkElements}`} href="resume/">
            Resume
          </Link>
        </li>
      </ul>
    </nav>
  );
}
