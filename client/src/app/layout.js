import { Inter } from "next/font/google";
import "./css/globals.css";
import React from "react";
const inter = Inter({ subsets: ["latin"] });
import DashboardLayout from "./dashboard/layout.js";
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="viewport"/>
      <body className={inter.className}>
          <DashboardLayout>
            {children}
          </DashboardLayout>
      </body>
    </html>
  );
}