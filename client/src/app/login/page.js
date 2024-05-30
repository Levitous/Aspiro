'use client';
import { useState } from 'react';
import "../register/css/register.css";
import TitleBox from "../../components/titlebox.js";
import { useRouter } from 'next/navigation';

// ------ Home Page --------------------------------------------------------------------- //
export default function Login() {
  return (
    <main>
      <TitleBox value={"Welcome back."}/>
      <Loginform/>
    </main>
  );
};

// ------ Local Components ------------------------------------------------------------- //

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Loginform = () => {
  const router = useRouter();
  var [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', event.target.username.value);
    formData.append('password', event.target.password.value);
  
    try {
      const response = await fetch(`${backendURL}/Login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      const result = await response.json(); 
      if (result.message === "Login Successful") { 
        const userResponse = await fetch(`${backendURL}/fetch/userinfo`, {
          credentials: 'include', // you need this for the session cookies to be sent!
        });
        const userInfo = await userResponse.json(); 
        router.push(`/profile/${userInfo.type}/${userInfo.username}`);
      } else {
        setError("Login failed: " + result.error); 
      }
    } catch (error) {
      setError(error.toString()); 
    }
  };
  
  
  return (
    <div className="login-container">
      <div className='signupBox'>
        <form id="regForm" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">User Name:</label>
            <input type="text" id="username" name="username" placeholder='Enter Username' required />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder='Enter Password' required />
            <button id="submitButton" type="submit">Sign In</button>
          </div>
        </form>
      </div>
      {!error ? (
        <div>{error}</div>
      ):(
        <div className="errormessage">
          <p>{error}</p>
        </div>
      )}
      
    </div>
  );
};

