"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../layout.module.css";
import { usePathname } from "next/navigation";
import { Nav, Navbar } from "react-bootstrap";
import { FaBars } from 'react-icons/fa'



export default function LayoutNavbar() {


	const path = usePathname();



	const links = [
		{ href: '/', label: 'Home', hrefQuery: '/' },
		{ href: 'aboutMe/', label: 'About Me', hrefQuery: '/aboutMe' },
		{ href: 'projects/', label: 'Projects', hrefQuery: '/projects' },
		{ href: 'contactMe/', label: 'Contact Me', hrefQuery: '/contactMe' },
		{ href: 'resume/', label: 'Resume', hrefQuery: '/resume' }

	]


	return (

		<>

			<Navbar className={styles.navBar} expand="lg" fixed="top" collapseOnSelect variant="dark">
				<Navbar.Brand>Weston J. Wood</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav">
					<div className="bs-emphasis-color me-auto">
						<FaBars />
					</div>
				</Navbar.Toggle>
				<Navbar.Collapse id="responsive-navbar-nav" className={styles.navElements}>
					<Nav className="ms-auto" >
						{links.map((item) => (

							<Nav.Link as="div">	<Link className={`${path === item.hrefQuery ? 'active' : ''} ${styles.LinkElements}`} href={item.href}>{item.label}</Link></Nav.Link>
						))}
					</Nav>
				</Navbar.Collapse>

			</Navbar>



		</>
	);
}
