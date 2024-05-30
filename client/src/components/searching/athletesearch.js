import React, { useState, useEffect } from "react";
import "../css/splitsearch.css";
import AthleteCard from "../cards/athletecard";
import TitleBox from "../titlebox.js";
import Map from "../map.js";
import { FaSearch } from "react-icons/fa";
import Suspense from "react";
import { useRouter } from 'next/navigation';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const AthleteSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sport, setSport] = useState("");
  const [school, setSchool] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sportsOptions, setSportsOptions] = useState([]);
  const [schoolsOptions, setSchoolsOptions] = useState([]);
  const [titleValue, setTitleValue] = useState("");

  const useQueryParams = () => {
    const [params, setParams] = useState({});
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const queryParams = {};
        searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        setParams(queryParams);
      }
    }, []);
    return params;
  };

  const queryParams = useQueryParams();

  async function handleSearch(){
    let endpoint = `${backendURL}/search/athletes`;
    let searchBody = { searchTerm, sport, school };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchBody),
      });
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setSearchResults([]);
    }
  };
  useEffect(() => {
      setSearchTerm(queryParams.query);
      handleSearch();
  }, [queryParams]);

  useEffect(() => {
    const fetchSports = async () => {
      const response = await fetch(`${backendURL}/fetch/sports`);
      const data = await response.json();
      setSportsOptions(data || []);
    };
    fetchSports();

    const fetchSchools = async () => {
      const response = await fetch(`${backendURL}/fetch/schools`);
      const data = await response.json();
      setSchoolsOptions(data || []);
    };
    fetchSchools();
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if(searchTerm === ""){
      setTitleValue(`Browse Student Athletes`);
    }else{
      setTitleValue(`Student Athletes matching "${searchTerm}"`);
    }
  });
  return (
    <div id="everything">
      <TitleBox value={titleValue}/>
      <div id="bothsides">
        <div id="splitsearch" /* Left Side */ >
          <div id="filters">
            <input
              id="splitsearchinput"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search Athletes..."
            />
            <select className="splitsearchselect"
              value={sport} onChange={(e) => setSport(e.target.value)}>
              <option value="">Sport</option>
              {sportsOptions.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <select className="splitsearchselect"
              value={school} onChange={(e) => setSchool(e.target.value)}>
              <option value="">School</option>
              {schoolsOptions.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <button type="submit" id="splitsearchbutton">
              <FaSearch/>
            </button>
          </div>
            <div id="results">
              <ul>
                {searchResults.map((result, index) => (
                  <AthleteCard
                    key={index}
                    firstname={result.firstname}
                    lastname={result.lastname}
                    username={result.username}
                    school={result.schoolName}
                    sport={result.sportName}
                  />
                ))}
              </ul>
            </div>
        </div>
        <div id="splitmap" /* Left Side */ >
          <Map/>
        </div>
      </div>
    </div>
  );
};

export default AthleteSearch;