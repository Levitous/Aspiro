"use client";
import React, { useState } from "react";
import "../css/searchbar.css";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar () {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    if(searchTerm === ""){
      e.preventDefault();
      router.push(`/search/schools/all`);
    }else{
      e.preventDefault();
      router.push(`/search/schools/${searchTerm}`);
    }
    setSearchTerm("");
  }

  return (
    <form id="searchbar" onSubmit={(e)=>handleSearch(e)}>
      <input id="searchbarinput" type="text"
        value={searchTerm} onChange={(e) => handleChange(e)}
          placeholder="Search for Schools" />
      <button id="searchbarbutton" type="submit">
        <FaSearch/>
      </button>
    </form>
  );
};
