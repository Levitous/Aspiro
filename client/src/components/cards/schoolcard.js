import {useRouter} from "next/navigation";
import { RiProfileLine } from "react-icons/ri";
import "./css/card.css";
import Link from "next/link";

export default function SchoolCard ( {rank, name, address, city, state, sport} ) {
  if(address === "NULL"){
    address = null;
  }
  return (
    <div className="schoolcard" style={{maxHeight:"200px"}}>
      <div id="rankblock">
        <div id="ranking">
          Ranked #{rank} for {sport} in the US</div>
      </div>
      
      <div id="nameloc">
        <div>{name}</div>
        <div className="flex-grow"/>
        <Link href={`/profile/school/${name}`}>
          <button id="visitbutton">
            view <RiProfileLine />
          </button>
        </Link>
      </div>
      
      <div id="locationarea">
        {address ?(<span>{address}, {city}, {state}</span>):(<span>{city}, {state}</span>)} 
      </div>
    </div>
  );
}