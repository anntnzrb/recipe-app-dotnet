import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react"; // Import React
import Link from 'next/link'; // Import Link
import styles from './layout.module.css'; // Import CSS Module

// Simple Navbar component (can be moved to its own file later)
const Navbar = () => (
  <header className={styles.navbar}> {/* Use header tag and class */}
    <Link href="/recipes">Recipe App</Link> {/* Use Link */}
  </header>
);

// Simple Footer component (can be moved to its own file later)
const Footer = () => (
  <footer className={styles.footer}> {/* Use class */}
    <p>&copy; {new Date().getFullYear()} Recipe App. All rights reserved.</p> {/* Dynamic year */}
  </footer>
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Management App", // Updated title
  description: "Manage your favorite recipes", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={styles.container}> {/* Add container div */}
          <Navbar />
          <main className={styles.mainContent}> {/* Use class, remove inline style */}
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
