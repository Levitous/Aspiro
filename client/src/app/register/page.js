'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
// import Search from "../components/search";
import "./css/register.css";
import TitleBox from "../../components/titlebox";
import Link from "next/link";
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ------ Home Page --------------------------------------------------------------------- //
export default function Register() {
  const router = useRouter();
  return (
    <main>
      <TitleBox imagepath={`${backendURL}/public/images/banner2.png`} value={"Are you an Athlete, or Faculty?"}/>
        <div className="choicebuttons">
          <Link href="/register/athlete">
            <div className="box">
              <div className="buttonText">Student Athlete</div>
            </div>
          </Link>
          <Link href="/register/faculty">
          <div className="box">
            <div className="buttonText">School Faculty</div>
          </div>
          </Link>
        </div>
    </main>
  );
}