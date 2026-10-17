import * as React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import styles from "./layout.module.css";
import LayoutNavbar from "./components/navbar";
import ClusterMeshBackground from "./components/clusterMeshBackground";
import NvimStatusBar from "./components/nvimStatusBar";
import Loading from "./loading";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
    <html lang="en" data-bs-theme="dark">
      <body className={`${inter.className} ${inter.variable} ${jetbrainsMono.variable} ${styles.layoutContainer}`}>
        <ClusterMeshBackground />
        <a href="#main-content" className={styles.skipLink}>Skip to content</a>
        <LayoutNavbar />
        <Suspense fallback={<Loading />}>
          <main id="main-content" tabIndex={-1} className={styles.content}>{children}</main>
        </Suspense>
        <NvimStatusBar />
      </body>
    </html>
  );
}
