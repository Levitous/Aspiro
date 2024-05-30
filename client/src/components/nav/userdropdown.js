'use client';
import React, { useEffect, useState } from 'react';
import {Dropdown,
        DropdownTrigger,
        DropdownMenu,
        DropdownItem,
        Avatar} from "@nextui-org/react";
import { ImProfile } from "react-icons/im";
import { FaSignInAlt } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import Link from 'next/link';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function UserDropDown() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userdata, setUserdata] = useState([]);

    const fetchIsLoggedIn = () =>{
        fetch(`${backendURL}/api/auth/status`,
        {method: 'GET', credentials: 'include'})
        .then(response => response.json())
        .then(data => setIsLoggedIn(data.isLoggedIn))
        .catch(error => console.error('Error:', error));
    };
    
    useEffect(() => {
        if(isLoggedIn){
            if(userdata.length == 0){
                fetch(`${backendURL}/fetch/userinfo`,
                {method: 'GET', credentials: 'include'})
                .then(response => response.json())
                .then(data => {
                    setUserdata(data);
                    setProfilePhoto(data.profilePhoto);
                    console.log(data);
            }).catch(error => console.error('Error:', error))}
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        fetch(`${backendURL}/logout`,
        { method: 'POST', credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if(data.message === "Success"){
                setIsLoggedIn(false);
                setProfilePhoto("");
            }
        })
        .catch(error => console.error("Error: ", error));
        router.push("/");
    };

    return (
        <div>
            {(isLoggedIn) ? (
                <Dropdown className="dark text-foreground">
                    <DropdownTrigger>
                        {userdata.profilePhoto ? (
                            <Avatar onClick={fetchIsLoggedIn}
                            className="transition-transform avatarbutton"
                            src={`${backendURL}/${userdata.profilePhoto}`} />
                        ) : (
                            <Avatar
                            className="transition-transform avatarbutton"
                            src=""/>
                        )}
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Dropdown Menu">
                        <DropdownItem className="welcomemessage" id='welcomemessage'>
                            Welcome back, {userdata.firstname}
                        </DropdownItem>
                            
                            <DropdownItem>
                            <Link href={`/profile/${userdata.type}/${userdata.username}`} className="fill">
                                <button className="dropdownbutton">
                                <ImProfile className="dropdownIcon" />Your Profile
                                </button>
                            </Link>
                            </DropdownItem>

                        <DropdownItem color="danger" onClick={handleLogout}>
                                <FaSignOutAlt className="dropdownIcon"/>Log out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            ) : (
                <Dropdown placement="bottom-end" className="dark text-foreground">

                    <DropdownTrigger>
                        <Avatar onClick={fetchIsLoggedIn}
                                className="transition-transform avatarbutton"
                                src=""/>
                    </DropdownTrigger>

                    <DropdownMenu aria-label="Dropdown Menu" variant="flat">

                        <DropdownItem key="login">
                        <Link href="/login" className="fill">
                            <button className="dropdownbutton">
                            <FaSignInAlt className="dropdownIcon"/>Sign in
                            </button>
                        </Link>
                        </DropdownItem>

                        <DropdownItem key="register">
                        <Link href="/register" className="fill">
                            <button className="dropdownbutton">
                            <FaAddressCard className="dropdownIcon"/>Join Aspiro
                            </button>
                        </Link>
                        </DropdownItem>

                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    );
}