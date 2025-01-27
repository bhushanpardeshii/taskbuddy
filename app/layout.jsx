import {  Mulish } from "next/font/google";
import "./globals.css";

const mulish = Mulish({
  subsets: ['latin'], // Choose the character subset (e.g., 'latin')
  weight: ['400', '700'], // Add font weights (e.g., regular, bold)
  variable: '--font-mulish', // Optional: define a custom CSS variable for the font
});

export const metadata = {
  title: "TaskBuddy",
  description: "A simple task management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${mulish.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
