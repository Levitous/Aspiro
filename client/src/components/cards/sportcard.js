import "./css/card.css";

const SportCard = ( {value} ) => {
    return (
        <div className='sportcard'>
                <div id="name">{value}</div>
        </div>
    );
};
export default SportCard;

