import "./css/profiles.css";
import { HiDocumentText, HiDocumentPlus } from "react-icons/hi2";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useEffect, useState } from "react";
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Resume({isMyProfile, resume}){
    return (
        <div style={{display:"hidden"}} className="flex-grow">
        {(resume || isMyProfile) && (
            <div id="resumearea" className="fill">
                {(isMyProfile) ? (
                <Popover placement="bottom">
                    <PopoverTrigger>
                        <div className='containertitle'>
                            {resume ?(
                            <HiDocumentText className="profIcon"/>
                            ):(
                            <HiDocumentPlus className="profIcon"/>
                            )}
                            Resume
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="dark">
                        <div className="popover">
                            <button className="fileupload" onClick={e=>{
                                let input = document.getElementById("docinput");
                                input?.click();
                            }}>update
                            </button>
                            <input  name="resume" id="docinput" type="file" 
                                    accept="application/pdf" onChange={(e) => {
                                    const file = e.target.files[0]; 
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    fetch(`${backendURL}/users/updateresume`,
                                        { method: 'POST', body: formData, credentials: "include" })
                                        .then(response => response.json())
                                        .then(data => {
                                            if(data.message === "Success"){
                                                document.parentNode.setResume(data.resume);
                                                document.parentNode.forceUpdate();
                                            }
                                        })
                                        .catch(error => console.log("Upload Failure:", error));
                            }}/>
                            {resume && (
                                <form onSubmit={e => {
                                    fetch(`${backendURL}/users/removeresume`,
                                    { method: 'POST', credentials: 'include' })
                                    .then(response=>response.json())
                                    .then(data => {
                                        if(data.message === "Success"){
                                            Document.parentNode.setResume("");
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
                ):(
                <div className='containertitle'>
                    <HiDocumentPlus className="profIcon" />Resume
                </div>
                )}
                <div className="containerentry">
                    {resume ? (
                        <div id="resume">
                            <iframe
                                src={`${backendURL}/${resume}`}
                                style={{width:"100%", height:"100%"}}
                                id="resume">
                            </iframe>
                        </div>
                    ):(
                        <div id="resume">
                            <p>No resume uploaded</p>
                        </div>
                    )}
                </div>
            </div>
        )}
        </div>
    ); 
}