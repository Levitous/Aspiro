import Image from "next/image";
import {useRouter} from "next/navigation";

const AthleteCard = ( {firstname, lastname, username, school, sport} ) => {
    const router = useRouter();

    function loadPage () {
        router.push(`/profile/athlete/${username}`);
    }
    
    return (
        <div className='card' onClick={loadPage}>
            <li className="link">
                {firstname} {lastname}
                <div id="school">Attends {school}</div>
                <div id="sport">{sport}</div>
                {/* <div className='profilePhoto'><Image src={profilePhoto} alt=''/></div> */}
            </li>
        </div>
    );
};
export default AthleteCard;