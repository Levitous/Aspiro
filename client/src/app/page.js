'use client';
import "./css/globals.css";
import TitleBox from "../components/titlebox.js";
import React, { useEffect, useState, useMemo } from "react";
import SchoolCard from "../components/cards/schoolcard.js";
import SportCard from "../components/cards/sportcard.js";
import { Tabs, Tab } from "@nextui-org/react";
import { useLoadScript, GoogleMap, Marker  } from '@react-google-maps/api';
import { ScrollShadow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import StateCenters from "./statecenters.js";
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ------ Home Page --------------------------------------------------------------------- //
export default function Home() {
  // ---------- Variable Declarations ----------------------------- //
    const endpoint = `${backendURL}/search/schoolsbysport`;
    const router = useRouter();
    // Sports Vars
    const [searchTerm, setSearchTerm] = useState([]);
    const [sports, setSports] = useState([]);
    const [sportSelection, setSportSelection] = useState("");

    // Map Vars
    const [hoveredState, setHoveredState] = useState(null);
    const [clickedSchool, setClickedSchool] = useState(null);
    const [mapResultsCenter, setMapCenter] = useState({ lat: 39, lng: -97 }); // Default to the center of the US
    const [showIntro, setShowIntro] = useState(true);
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    // Search Vars
    const [searchResults, setSearchResults] = useState(null);
    const [currentTab, setCurrentTab] = useState("sports");
    const [message, setMessage] = useState("");

  // ---------- SPORTS ARRAY FUNCITONALITY  ------------------------ //
  useEffect(() => {
    fetch(`${backendURL}/fetch/sports`)
    .then(response => response.json())
    .then(data => {
      setSports(data || []);
    })
    .catch(error => console.log("Failed to fetch sports: ", error));
  }, []);

  const selectSport = (name) => {
    setSportSelection(name);
    setCurrentTab("states");
  }

  // ----------- MAP FUNCTIONALITY -------------------------------- //

  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(
    () => ({ lat: 39, lng: -97 }),
    []
  );

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      clickableIcons: true,
      scrollwheel: true,
      streetViewControl: false,
      fullscreenControl: false,
      draggable: true,
      zoomControl: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries: libraries,
  });

  const onLoad = async (map) => {
    var availableStates;
    const query = {"sport": sportSelection};
    fetch(`${backendURL}/search/statesbysport`, {method: 'POST',
      body: JSON.stringify(query),
      headers: {"Content-Type": "application/json"}})
    .then(response => response.json())
    .then(data => {
      availableStates = data || [];
      map.data.loadGeoJson('/StateBoundaries.json');
      map.data.setStyle(function(feature){
        var state = feature.Gg.name;
        var color;
        var opacity;
        if(availableStates){
          if(availableStates.includes(state)){
            color = 'green';
            opacity = 0.75;
          }else{
            color = 'black';
            opacity = 0.5;
          }
        }else{
          color = 'black';
          opacity = 0.5;
        }
        return{
            fillColor: color,
            fillOpacity: opacity,
            strokeWeight: 0.1,
        };
      });
      map.data.addListener('mouseover', event => {
        map.data.overrideStyle(event.feature, { fillColor: 'green'});
        setHoveredState(event.feature.getProperty('name'));
      });
      map.data.addListener('mouseout', event => {
        setHoveredState(null);
        map.data.revertStyle();
      });
      map.data.addListener('click', event => {
        const location = event.feature.getProperty('name');
        setMapCenter(StateCenters[location]);  
        handleSearch(location);
      });
    })
    .catch(error => console.error('Error:', error));
  };

  // This gets the lat and lng of the cities that each school is located using maps api and adds them to the searchResults variable
  const onLoadMapResults = async () => {
    const updatedResults = await Promise.all(searchResults.map(async (school) => {
        const response = await fetch(`
          https://maps.googleapis.com/maps/api/geocode/json?address=${
          encodeURIComponent(school.address + ", " + school.city + ', ' + school.state)
          }&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
        `);
        const data = await response.json();
        if (data.status === "OK") {
            const { lat, lng } = data.results[0].geometry.location;
            return { ...school, lat, lng };
        } else {
            return { ...school, lat: null, lng: null };  
        }
    }));
    setSearchResults(updatedResults); // Update searchResults with lat and lng
};


  // ----------- START SEARCH RESULTS --------------------------------- //
  function handleSearch(location) {
    const query = {"sport": sportSelection, "location": location};
    fetch(endpoint, {method: 'POST',
      body: JSON.stringify(query),
      headers: {"Content-Type": "application/json"}})
    .then(response => response.json())
    .then(data => {
      if(data.error){
        setMessage(`No ranked schools found for ${selectedSport} in ${location}.`);
      }else{
        setSearchResults(data.result || []);
        setCurrentTab("results");
      }
    })
    .catch(error => console.error('Error:', error));
  };

  // ----------- START RETURN ----------------------------------------- //

  return (
    <main>
      {showIntro && (<TitleBox imagepath={`${backendURL}/public/images/banner1.png`}/> )}

      <Tabs 
        aria-label="Options" 
        color="primary" 
        variant="underlined"
        isPressable={true}
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]"
        }}
        selectedKey={currentTab}
        onClick={event=>{
          setCurrentTab(event.target.key);
          setClickedSchool(null);
        }}
      >

      
        <Tab 
        on
          key="sports" 
          title={
            <div className="flex items-center space-x-2">
              {/* Icon here */}
              <span>Select a Sport</span>
            </div>
          }
        >
          <input id="sportsearch" type="text"
              value={searchTerm} onChange={(e) => {
                  setSearchTerm(e.target.value);
                  const query = {"searchterm": searchTerm};
                  fetch(`${backendURL}/search/sports`,
                    {
                    method: 'POST',
                    body: JSON.stringify(query),
                    headers: {"Content-Type": "application/json"}
                    })
                  .then(response => response.json())
                  .then(data => setSports(data.result || []))
                  .catch(error => console.log("Failed to fetch sports: ", error));
                }
              }
              placeholder="Find your Sport" />
          <ScrollShadow>
            <ul id="sportselect">
              {sports.map((sport, index) => (
                <div key={index} onClick={event => {
                  selectSport(sport.name);
                  setShowIntro(false);
                }}>
                  <SportCard value={sport.name}/>
                </div>
              ))}
            </ul>
            </ScrollShadow>
          </Tab>

          {sportSelection && (
            <Tab
            key="states"
            title={
              <div className="flex items-center space-x-2">
                {/* Icon here */}
                <span>Select a State</span>
              </div>
            }
          >

            {/* Map & Map Options */}
            <div style={{borderRadius:"1rem", border:"2px solid black"}}>
            <GoogleMap
              style={{borderRadius:"1rem"}}
              options={mapOptions}
              zoom={4}
              center={mapCenter}
              mapTypeControl={false}
              mapContainerStyle={{width: '100%', height: '60vh'}}
              onLoad={onLoad}
            />
            </div>
            {/* State Hover Effects */}
            {hoveredState && (
              <div style={{ position: 'relative',
              bottom: '0', left: '0', right: '0',
              backgroundColor: 'black', padding: '10px',
              zIndex: 1, fontSize: '1.5rem', textAlign: 'center' }}>
                Find {sportSelection} schools In {hoveredState}
              </div>
            )}
            {message && (
              <div style={{ position: 'relative',
              bottom: '0', left: '0', right: '0',
              backgroundColor: 'black', padding: '10px',
              zIndex: 2, fontSize: '1.5rem', textAlign: 'center' }}>
                {message}
              </div>
            )}
          </Tab>
          )}

        {searchResults && (
          <Tab
          key="results"
          title={
            <div className="flex items-center space-x-2">
              {/* Icon here */}
              <span>Search Results</span>
            </div>
          }>
          <div id="everything">
            {(typeof window !== 'undefined' && window.innerWidth > 800) &&(
            <ul id="splitsearch">
              {searchResults.map((school, index) => (
                  <SchoolCard
                    key={index}
                    name={school.name}
                    rank={school.sportranking}
                    address={school.address}
                    city={school.city}
                    state={school.state}
                    sport={`${sportSelection}`}
                  />
              ))}
            </ul>
            )}
            <div id="splitmap">
            {/* Zoomed state Map & Map Options */}
            <div style={{borderRadius:"1rem", border:"2px solid black", overflow:"hidden"}}>
            <GoogleMap
              options={mapOptions}
              zoom={6}
              center={mapResultsCenter}
              mapTypeControl={false}
              mapContainerStyle={{width: '100%', height: '60vh'}}
              onLoad={onLoadMapResults}
              >
            {searchResults.map((school, index) => (
                school.lat && school.lng && (
                    <React.Fragment key={index}>
                      <Marker
                        onClick={(e) => {
                          setClickedSchool(school);
                        }}
                        position={{ lat: school.lat, lng: school.lng }}
                        title={`${school.name}`}
                        label={{
                          text:`${school.sportranking}`,
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: "0.6rem",
                        }}
                        />
                    </React.Fragment>
                )
            ))}
            </GoogleMap>
            </div>
            <div id="schoolinfo">
            {clickedSchool && (
                <SchoolCard
                name={clickedSchool.name}
                rank={clickedSchool.sportranking}
                address={clickedSchool.address}
                city={clickedSchool.city}
                state={clickedSchool.state}
                sport={`${sportSelection}`}
              />
            )}
            </div>
            </div>
            </div>
        </Tab>
        )}
      </Tabs>
    </main>
  );
}
