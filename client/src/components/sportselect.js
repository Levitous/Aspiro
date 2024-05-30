'use client';
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import { useRouter } from 'next/navigation';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SportSelect() {
    const router = useRouter();
    const [sports, setSports] = useState([]);
    const [selection, setSelection] = useState("");

    useEffect(() => {
        fetch(`${backendURL}/fetch/sports`,
        {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            setSports(data);
        })
        .catch(error => console.error('Error:', error));
    }, []);

    return (
        <ul id="sportselect">
            {sports.map((sport, index) => (
                <Card shadow="sm" key={index} isPressable onPress={() => setSelection(sport.name)}>
                <CardBody className="overflow-visible p-0 card">
                    <b>{sport.name}</b>
                    {/* <Image
                        shadow="sm"
                        radius="lg"
                        width="100%"
                        alt={item.title}
                        className="w-full object-cover h-[140px]"
                        src={item.img}
                    /> */}
                </CardBody>
              </Card>
            ))}
        </ul>
    );
}

