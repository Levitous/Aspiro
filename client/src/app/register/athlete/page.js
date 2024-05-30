'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import "../css/register.css";
import TitleBox from "../../../components/titlebox";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

export default function Athletesignup() {
  const router = useRouter();
  return (
    <main>
      <TitleBox value={"Student Athlete Registration Form"}/>
      <Signup/>
    </main>
  );
};
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Signup = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [school, setSchool] = useState("");
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [sport, setSport] = useState("");
  const [sportOptions, setSportOptions] = useState([]);
  const [selectedInput, setSelectedInput] = useState(["firstname"]);

  useEffect(() => {
    // Fetch schools options from the database
      fetch(`${backendURL}/fetch/schools`)
      .then(response => response.json())
      .then(data => setSchoolOptions(data || []))
      .catch(error => setError(error));
      
      fetch(`${backendURL}/fetch/sports`)
      .then(response => response.json())
      .then(data => setSportOptions(data || []))
      .catch(error => setError(error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new URLSearchParams(new FormData(event.target));
    const endpoint = `${backendURL}/register/athlete`;
  
    fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      if (data.message === "Registration successful") {
        router.push("/login");
      } else {
        setError(data.message);
      }
    })
    .catch(error => {
      console.log(error);
      setError("Registration failed for an unknown reason. Please try again.");
    });
  }

  return (
    <div className="register-container">
      <div className='signupBox'>
        
        {error && <div className="error">{error}</div>}

        <form id="regForm" onSubmit={handleSubmit}>
          <div>
            {/* First Name */}
            {selectedInput === "firstname" &&(
              <p className="messagebox">
                First name must be at least 2 letters.<br/>
                hyphens & apostrophes welcome.
              </p>
            )}
            <label htmlFor="firstname">First name</label>
            <input type="text" id="firstname" name="firstname"
            onFocus={e=>setSelectedInput("firstname")} required/>
              
            {/* Last Name */}
            {selectedInput === "lastname" &&(
              <p className="messagebox">
                Last name must be at least 2 letters.<br/>
                hyphens & apostrophes welcome.
              </p>
            )}
            <label htmlFor="lastname">Last name</label>
            <input type="text" id="lastname" name="lastname" 
            onFocus={e=>setSelectedInput("lastname")} required />
              
            {/* Email */}
            {selectedInput === "email" &&(
              <p className="messagebox">
                Email must be a valid email address.
              </p>
            )}
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" 
            onFocus={e=>setSelectedInput("email")} required />
            
            {/* Username */}
            {selectedInput === "username" &&(
              <p className="messagebox">
                Username must be at least 5 characters long<br/>
                and may include letters and numbers only.
              </p>
            )}
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" 
            onFocus={e=>setSelectedInput("username")} required />
            
            {/* Password */}
            {selectedInput === "password" &&(
              <p className="messagebox">
                Password needs at least 8 characters, including:<br/>
                  1 uppercase letter<br/>
                  1 lowercase letter<br/>
                  1 number<br/>
                  1 symbol
              </p>
            )}
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" 
            onFocus={e=>setSelectedInput("password")} required />
            
            {/* Confirm password */}
            <label htmlFor="password">Confirm Password</label>
            <input type="password" id="passconfirm" name="passconfirm"
            onFocus={e=>setSelectedInput("")} required />

          {/* School Selection */}
          <label htmlFor="schoolSelect">What school do you attend?</label>
          <input name="school" value={school} list="schoolOptions"
            onChange={(e) => setSchool(e.target.value)}
            onFocus={e=>setSelectedInput("")} required/>
          <datalist id="schoolOptions">
            <option value="">Select School</option>
            {schoolOptions.map((option, index) => (
              <option key={index} value={option.id}>{option.name}</option>
            ))}
          </datalist>

          {/* Sport Selection */}
          <label htmlFor="query">What sport do you play?</label>
          <input name="sport" list="sportOptions"
              value={sport} onChange={(e) => setSport(e.target.value)} 
              onFocus={e=>setSelectedInput("")} required/>
          <datalist id="sportOptions">
              <option value="">Select Sport</option>
              {sportOptions.map((option, index) => (
              <option key={index} value={option.id}>{option.name}</option> ))}
          </datalist>

            {/* Submit Form */}
            <button id="submitButton" type="submit">Join Aspiro</button>

          </div>
        </form>
        {/* End of Form */}
      </div>
    </div>
  );
};