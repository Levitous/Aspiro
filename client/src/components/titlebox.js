export default function TitleBox ({value, imagepath}) {

    return (
      <div className="titlebox flex-col" style={{objectFit:"fill"}}>
        {imagepath && (<div className="titleboximage"><img src={imagepath} alt="banner image"/></div>)}
        <div className="titleboxtext">{value}</div>
      </div>
    );
  };