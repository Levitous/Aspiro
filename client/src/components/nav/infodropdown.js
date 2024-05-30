'use client';
import React, { useEffect, useState } from 'react';
import {Dropdown,
        DropdownTrigger,
        DropdownMenu,
        DropdownItem} from "@nextui-org/react";
import { IoInformationCircle } from "react-icons/io5";
import Link from 'next/link';

export default function InfoDropDown() {
    return (
        <Dropdown className="dark text-foreground">
            <DropdownTrigger>
            <div class="navIcon"><IoInformationCircle/></div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dropdown Menu">
                <DropdownItem>
                <Link href="/FAQ">Frequently Asked Questions</Link>
                </DropdownItem>
                <DropdownItem >
                <Link href="/AboutTeamSix">About Team Six</Link>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}