import "../css/globals.css";
import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import NavigationBar from '../../components/nav/navigationbar.js';
import Link from 'next/link';

const FooterBar = () => {
  return (
    <footer>
      <h3>&copy;Aspiro - <Link href="/AboutTeamSix">Team Six</Link> - Software Engineering Spring 2024 - San Francisco State University</h3>
    </footer>
  );
};

export default function DashboardLayout({ children }) {
  return (
    <section>
          <NextUIProvider className="dark text-foreground flex flex-col h-screen">
              <NavigationBar/>
                {children}
              <FooterBar/>
          </NextUIProvider>
    </section>
  );
}