'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
// import Search from "../components/search";
import "../css/register.css";

// ------ Home Page --------------------------------------------------------------------- //
export default function Adminsignup() {
  const router = useRouter();
  return (
    <main>
      <HeadTitle/>
      <Signup/>
    </main>
  );
}

// ------ Local Components ------------------------------------------------------------- //
const HeadTitle = () => {
  return (
    <div className="titlebox">
      Aspiro Team Registration
    </div>
  );
};


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Signup = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new URLSearchParams(new FormData(event.target));

    try {
      const response = await fetch(`${backendURL}/register/admin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Registration failed: ' + response.statusText);
      }

      const data = await response.json();
      if (data.message === "Registration successful") {
        window.location.replace("/login");
      } else {
        setError(data.error || "Registration failed for an unknown reason.");
        window.location.reload();
      }
    } catch (error) {
      setError(error.toString());
    }
  };

  return (
    <div className="register-container">
      <div className='signupBox'>
        {error && <div style={{color: 'red'}}>{error}</div>}
        <form id="regForm" onSubmit={handleSubmit}>
          <legend>Sign Up</legend>
          <div>
            {/* First Name */}
            <label htmlFor="firstname">First name:</label>
            <input type="text" id="firstname" name="firstname" placeholder='Enter your first name' required />
            <br />
            {/* Last Name */}
            <label htmlFor="lastname">Last name:</label>
            <input type="text" id="lastname" name="lastname" placeholder='Enter your last name' required />
            <br />
            {/* Email */}
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" placeholder='Enter Email' required />
            <br />
            {/* Employee ID */}
            <label htmlFor="ID">Employee ID:</label>
            <input type="text" placeholder='Enter your Employee ID' required />
            <br />
            {/* Username */}
            <label htmlFor="username">User Name:</label>
            <input type="text" id="username" name="username" placeholder='Enter Username' required />
            <br />
            {/* Password */}
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder='Enter Password' required />
            <br />
            {/* Confirm password */}
            <label htmlFor="password">Confirm Password:</label>
            <input type="password" id="passconfirm" name="passconfirm" placeholder='Confirm Password' required />
            <br />
            <button id="submitButton" type="submit">Register</button>
          </div>
        </form>
        {/* End of Form */}
      </div> 
    </div>
  );
};