"use client";
import "../../css/profiles.css";
import { IoMdSchool } from "react-icons/io";
import { TbOlympics } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import Image from "next/image";
import React, {useEffect, useState, useCallback} from "react";
import { useParams, useRouter } from 'next/navigation';
import { IoSend } from "react-icons/io5";
import { TbPhotoPlus, TbPhotoCheck } from "react-icons/tb";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Link from "next/link";
import Resume from "../../resume.js";
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Facultyprofile () {
    const router = useRouter();
    const params = useParams();
    const { username } = params; 
    const [facultyInfo, setFacultyInfo] = useState({});
    const [profilePhoto, setProfilePhoto] = useState("");
    const [resume, setResume] = useState("");
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [file, setFile] = useState("");
    const [posts, setPosts] = useState([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, plugins: [Autoplay()]})

    useEffect(() => {
        fetch(`${backendURL}/faculty/${username}`,
        {method: 'GET', credentials: 'include'})
        .then(response => response.json())
        .then(data => {
            setFacultyInfo(data);
            setProfilePhoto(data.profilePhoto);
            setResume(data.resume);
            setIsMyProfile(data.isMyProfile);
        })
        .then(
        fetch(`${backendURL}/posts/${username}`,
        {method: "GET", credentials: 'include'})
        .then(res => res.json())
        .then(data => setPosts(data.posts)))
        .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        if (emblaApi) {
        console.log(emblaApi.slideNodes()) // Access API
        }
    }, [emblaApi])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
      }, [emblaApi])

    const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const postsubmit = (event) => {
        event.preventDefault();
        const posttext = document.getElementById("inputcontainer").value;
        console.log(posttext);
        fetch(`${backendURL}/posts/create`, {
            method: 'POST',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.message === "Success") {
                console.log('Post Created:', data.message);
                const postID = data.postId;
                const newPost = {
                    postID: postID,
                    text: posttext.trim(),
                    photos: []
                };
    
                // checking for text
                if (posttext.trim() != '') {
                    newPost.text = posttext;
                    fetch(`${backendURL}/posts/addtext`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            text: posttext,
                            postID: postID
                        })
                    })
                    .then(textResponse => textResponse.json())
                    .then(textData => {
                        console.log('Text added:', textData);
                    })
                    .catch(textError => console.error('Failed to add text:', textError));
                }
                // checking and handling photo submissions
                if (file) {
                    const formData = new FormData();
                    formData.append('photo', file);
                    formData.append('postID', postID);
                    fetch(`${backendURL}/posts/addphoto`, {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    })
                    .then(photoResponse => photoResponse.json())
                    .then(photoData => {
                        console.log('Photo added:', photoData);
                        if (photoData && photoData.photo) {
                            newPost.photos.push({ photo: photoData.photo });
                        }
                        setPosts(prevPosts => [...prevPosts, newPost]);
                    })
                    .catch(photoError => console.error('Failed to add photo:', photoError));
                }
                else {
                    setPosts(prevPosts => [...prevPosts, newPost]);
                }
            } else {
                console.error('Failed to create post:', data.message);
            }
        })
        .catch(error => console.error('Error creating post:', error));
        //document.location.reload(true);
    }

    return (
        <main>
            <div className="profile">
                <div id="topthird">
                    <div className="background"/>
                    <div className="profilepic">
                        {facultyInfo.isMyProfile ? (
                            <Popover placement="bottom">
                                <PopoverTrigger>
                                    <div>
                                        {profilePhoto ? (
                                            <Image className="circle" 
                                            src={`${backendURL}/${profilePhoto}`} 
                                            width={205} height={205} alt='' />
                                        ) : (
                                            <Image className="circle" 
                                            src={`${backendURL}/public/images/defaultprofilephoto.jpg`} 
                                            width={205} height={205} alt='' />
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
                                        fetch(`${backendURL}/users/updateprofilephoto`,
                                            { method: 'POST', body: formData, credentials: "include" })
                                            .then(response => response.json())
                                            .then(data => {
                                                setProfilePhoto(data.photo);
                                            })
                                            .catch(error => console.log("Upload Failure:", error));
                                    }}/>
                
                                    {profilePhoto && (
                                        <form onSubmit={event => {
                                            fetch(`${backendURL}/users/removeprofilephoto`,
                                            { method: 'POST', credentials: 'include' })
                                            .then(response=>response.json())
                                            .then(data => {
                                                if(data.message === "Success"){
                                                    setProfilePhoto(null);
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
                                {profilePhoto ? (
                                    <Image className="circle" src={`${backendURL}/${profilePhoto}`} width={205} height={205} alt='' />
                                ) : (
                                    <Image className="circle" src={`${backendURL}/public/images/defaultprofilephoto.jpg`} width={205} height={205} alt='' />
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="container1">
                            {facultyInfo.firstname} {facultyInfo.lastname}
                </div>
                <div id="middlethird">
                    <div id="infoarea">
                        {/* Start Other Info Area */}
                        <div className='container2'>
                            <div className="containertitle">
                                <TbOlympics className="profIcon" />Coaches
                            </div>
                            <div className="containerentry">
                                {facultyInfo.sportName}
                            </div>
                        </div>

                        <div className='container2'>
                            <div className="containertitle">
                                <IoMdSchool className="profIcon" />Works at
                            </div>
                            <Link className="containerentry" href={`/profile/school/${facultyInfo.schoolName}`}>
                                <div>
                                    {facultyInfo.schoolName}
                                </div>
                            </Link>
                        </div>

                        <div className='container2'>
                            <div className='containertitle'>
                                <MdEmail className="profIcon" /> Contact {facultyInfo.firstname}
                            </div>
                            <div className="containerentry">
                                {facultyInfo.email}
                            </div>
                        </div>
                        {/* End */}
                    </div>
                    {(isMyProfile || resume) && (<Resume isMyProfile={isMyProfile} resume={resume}/>)}
                </div>
                <div id="bottomthird">
                {facultyInfo.isMyProfile && (
                    <div className="post">
                        <div className="top">
                            <button
                                onClick={e=>{
                                let input = document.getElementById("postmediaupload");
                                input?.click();}}
                                className="postbutton">
                                {file ? <TbPhotoCheck className="fill"/> : <TbPhotoPlus className="fill"/>}
                            <input
                                id="postmediaupload"
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={(event) => setFile(event.target.files[0])}
                            />
                            </button>
                        </div>
                        <div className="middle">
                            <textarea id="inputcontainer"
                                cols={40}
                                placeholder="Enter text here..."
                                rows={4} // Set the number of visible rows
                            />
                        </div>
                        <div className="bottom">
                            <button className="postbutton" onClick={postsubmit}>
                                Submit <IoSend className="inline-flex"/>
                            </button>
                        </div>
                    </div>
                    )}
                    {posts[0] && (
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
                                        posted by {facultyInfo.firstname} {post.timestamp}
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