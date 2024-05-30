"use client";
import React, { useEffect, useState, useMemo } from "react";
import SchoolCard from "../../../../components/cards/schoolcard.js";
import { useParams } from "next/navigation.js";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SchoolSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const params = useParams();

  useEffect(() => {
      const search = params.search || "all";
      handleSearch(search);
}, [params]);

  async function handleSearch(searchTerm){
    let endpoint = `${backendURL}/search/schools/${searchTerm}`;
    fetch(endpoint, {
      method: "POST", credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => {
      setSearchResults(data.result || [])
    }).catch(error => {
      console.error("Failed to fetch search results:", error);
      setSearchResults([]);
    });
  };

  return (
    <main>
        <ul id="browsesearch" className="fill">
              {searchResults.map((school, index) => (
                  <SchoolCard
                    key = {index}
                    name={school.name}
                    rank={school.ranking}
                    address={school.address}
                    city={school.city}
                    state={school.state}
                  />
              ))}
        </ul>
    </main>
  );
};

export default SchoolSearch;