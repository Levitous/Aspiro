"use client"
import "../../css/profiles.css";
import { useEffect, useState, useCallback } from 'react';
import {TbOlympics} from "react-icons/tb";
import { FaMapLocationDot } from "react-icons/fa6";
import { useParams } from 'next/navigation';
import { GiWhistle } from "react-icons/gi";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { ImProfile } from "react-icons/im";
import Image from "next/image";

import {Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar} from "@nextui-org/react";
import { useRouter } from 'next/navigation'

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Schoolprofile = () => {
    const name = decodeURI(useParams().name);
    const router = useRouter();
    const [schoolInfo, setSchoolInfo] = useState([]);
    const [schoolFaculty, setSchoolFaculty] = useState([]);
    const [posts, setPosts] = useState([]);

    const [sportRanks, setSportRanks] = useState([]);
    const [background, setBackground] = useState("");

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, plugins: [Autoplay()]})

    useEffect(() => {
        fetch(`${backendURL}/school/${name}`,
        {method: 'GET', credentials: 'include'})
        .then(response => response.json())
        .then(data => {
            setSchoolInfo(data);
            setBackground(data.background);
            }
        )
        .then(
        fetch(`${backendURL}/fetch/schoolfaculty/${name}`,
        {method: "GET", credentials: 'include'})
        .then(res => res.json())
        .then(data => {
            setSchoolFaculty(data);
        }))
        .then(
        fetch(`${backendURL}/fetch/sportranks/${name}`,
        {method: "GET", credentials: 'include'})
        .then(res => res.json())
        .then(data => {
            if(data.result){
                setSportRanks(data.result);
            }
        }))
        .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        if(schoolFaculty.length > 0){
            for(let faculty of schoolFaculty){
                fetch(`${backendURL}/posts/${faculty.username}`,
                {method: "GET", credentials: 'include'})
                .then(res => res.json())
                .then(data => {
                    for(let post of data.posts){
                        setPosts((previous => [...previous, post]));
                    }
                });
            }
        }
    }, [schoolFaculty]);

    useEffect(() => {
        if (emblaApi) {
            emblaApi.slideNodes();
        }
    }, [emblaApi])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
      }, [emblaApi])

    const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    return (
        <main>
            <div className="profileschool">
                {schoolInfo.isMySchool ? (
                    <Popover placement="bottom">
                        <PopoverTrigger>
                            <div>
                            {background ? (
                                <img className="backgroundimg" 
                                src={`${backendURL}/${background}`} width="100%" height="100%" alt="background"/>
                            ):(
                                <div className="background"/>
                            )}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="dark">
                                <div className="popover">
                                <button className="fileupload" onClick={e=>{
                                    let input = document.getElementById("profilephotoinput");
                                    input?.click();
                                }}>update</button>
            
                                <input name="photo" id="profilephotoinput" type="file" accept="image/*" onChange={(event) => {
                                    const file = event.target.files[0]; 
                                    const formData = new FormData();
                                    formData.append('photo', file);
                                    fetch(`${backendURL}/users/updatebackground`,
                                        { method: 'POST', body: formData, credentials: "include" })
                                        .then(response => response.json())
                                        .then(data => {
                                            setBackground(data.photo);
                                        })
                                        .catch(error => console.log("Upload Failure:", error));
                                }}/>
            
                                {background && (
                                    <form onSubmit={event => {
                                        fetch(`${backendURL}/users/removebackground`,
                                        { method: 'POST', credentials: 'include' })
                                        .then(response=>response.json())
                                        .then(data => {
                                            if(data.message === "Success"){
                                                setBackground(null);
                                            }
                                        })
                                        .catch(error=>console.log("Error: ", error));
                                    }}>
                                        <button className="removeButton" type="submit">remove</button>
                                    </form>
                                )}
                                </div>
                        </PopoverContent>
                    </Popover>
                    ) : (
                    <div>
                    {background ? (
                        <img className="backgroundimg" 
                        src={`${backendURL}/${background}`} width="100%" height="100%" alt="background"/>
                    ):(
                    <div className="background"/>
                    )}
                    </div>
                    )}
                <div className="schooltitle">            
                        {schoolInfo.name}
                </div>
                <div id="middlethirdschool">
                    {schoolInfo.ranking && (
                    <div className='container2'>
                        <div className="containertitle">
                            <TbOlympics className="profIcon"/>Ranked #{schoolInfo.ranking} Overall
                        </div>
                        <div className="containerentry">
                            in the US in Olympic Sports
                        </div>
                    </div>
                    )}

                    {schoolInfo.city && schoolInfo.state && (
                    <div className='container2'>
                        <div className='containertitle'>
                            <FaMapLocationDot className="profIcon"/> Located in
                        </div>
                        <div className="containerentry">
                            {schoolInfo.city}, {schoolInfo.state}
                        </div>
                    </div>
                    )}
                    
                    {sportRanks && sportRanks.map(sportrank => (
                    <div key={sportrank.rank} className='container2'>
                        <div className="containertitle">
                            <TbOlympics className="profIcon"/> Ranked #{sportrank.sportranking}
                        </div>
                        <div className="containerentry">
                             in {sportrank.name} Nationally
                        </div>
                    </div>
                    ))}

                    {schoolFaculty[0] && (
                        <div className='container2'>
                            <div className="containertitle">
                                    <GiWhistle className="profIcon"/> Coaches on Aspiro
                            </div>
                            <div className="containerentry"
                            style={{gap:"1rem", flexDirection:"row"}}>
                            {schoolFaculty.map(faculty => (
                                <Dropdown key={faculty.username} className="dark text-foreground">
                                <DropdownTrigger>
                                    {faculty.profilePhoto ? (
                                        <Avatar
                                        className="transition-transform avatarbutton"
                                        src={`${backendURL}/${faculty.profilePhoto}`}/>
                                    ) : (
                                        <Avatar
                                        className="transition-transform avatarbutton"
                                        src=""/>
                                    )}
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Dropdown Menu">
                                    <DropdownItem className="boldname">{faculty.firstname} {faculty.lastname}</DropdownItem> 
                                    <DropdownItem className="infoitem">
                                        <GiWhistle className="dropdownIcon"/>Coaches {faculty.sport}
                                        </DropdownItem>
                                    <DropdownItem>
                                        <button className="dropdownbutton" 
                                            onClick={e=>{router.push(`/profile/faculty/${faculty.username}`)}}>
                                            <ImProfile className="dropdownIcon"/>See Profile
                                        </button>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
                <div id="bottomthird">
                {posts.length > 0 && (
                <div className="fill" style={{display:"flex", flexDirection:"row"}}>
                    <button class="embla__prev" onClick={scrollPrev}><BiSolidLeftArrow /></button>
                    <div className="embla" ref={emblaRef}>
                        <div className="embla__container fill">
                            {/* Post Display Area */}
                            { posts && posts.map(post => (
                                <div key={post.postID} className="embla__slide post">
                                    <div className="posttext"></div>
                                    <div className="middle"  style={{padding:"1rem",
                                    alignContent:"center", alignItems:"center"}}>
                                        {post.text}
                                        {post.photos && post.photos.map((photo, index) => (
                                            <div key={index} style={{maxHeight:"100%"}}>
                                                <Image src={`${backendURL}/${photo.photo}`} 
                                                alt={"Post"}
                                                />
                                            </div>
                                            ))}
                                        </div>
                                    <div className="bottom timestamp">
                                        posted {post.timestamp}
                                    </div>
                                </div>
                            ))}
                            {/* End of Post Display Area */}
                        </div>
                    </div>
                    <button class="embla__next" onClick={scrollNext}><BiSolidRightArrow /></button>
                </div>
                )}
                </div>
            </div>
        </main>
    );
};

export default Schoolprofile;