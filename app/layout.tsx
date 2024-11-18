
import * as React from 'react'
import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutNavbar from "./components/navbar";
import Loading from './loading';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Weston J. Wood",
	description: "Minimal Vibe Portfolio Website by Weston J. Wood",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" >
			<body className={`${inter.className} ${styles.layoutContainer}`}>
				<LayoutNavbar />
				<Suspense fallback={<Loading />}>


					<main >{children}</main>


				</Suspense>
				<footer />
			</body>
		</html>
	);
}
