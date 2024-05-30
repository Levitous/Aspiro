'use client';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import SearchBar from "../searching/searchbar";
import UserDropDown from "./userdropdown";
import InfoDropDown from "./infodropdown";
import { FaGripfire } from "react-icons/fa";

const NavigationBar = () => {
  return (
    <header>
      <div id="nav">
        <Link href="/" id="navhome" style={{marginLeft:"0.5rem"}}>
              <div className="magic" style={{marginRight:"0.5rem"}}>aspiro </div>
              <FaGripfire id="homeIcon"/>
        </Link>
          
        <div className="magic" style={{paddingRight:"1rem"}}/> 

        <div className="navItem flex-grow">
          <SearchBar/>
        </div>

        <div className="magic" style={{paddingLeft:"1rem"}}/>

        <div style={{marginRight:"0.5rem"}} className="magic navIcon">
          <InfoDropDown/>
        </div>

        <div className="navItem" style={{marginRight:"0.5rem"}}>
          <UserDropDown/>
        </div>

      </div>
    </header>
  );
};

export default NavigationBar;


{/* <div id="navsearch">{<SearchBar/>}</div> */}