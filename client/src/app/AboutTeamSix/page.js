"use client"
import TitleBox from "../../components/titlebox";

export default function TeamSix () {
    return (
                <main >
                <TitleBox value={"About"}/>
                <div style={{
                    background:"var(--blackIce)",
                    padding:"1rem",
                    margin:"0 5% 1rem 5%",
                    borderRadius:"1rem",
                    border:"1px solid black"     
                }}>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <div style={{fontSize:"1.2rem"}}>
                        Aspiro is brought to you by Team Six,
                        A group of students at San Francisco State University.
                        <br />
                    </div>
                    <div className="indented">
                        <div style={{fontSize:"1.2rem", color: "#E84E3F"}}> 
                            Levi Leach
                        </div>
                        <div className="indented" style={{color: "#D3D3D3", fontSize:"0.8rem"}}> 
                            Team Lead
                        </div>
                        <div style={{fontSize:"1.2rem", color: "#E84E3F"}}>
                            Cristal Aguilar
                        </div>
                        <div className="indented" style={{color: "#D3D3D3", fontSize:"0.8rem"}}>
                            Front End Lead, Document Master
                        </div>
                        <div style={{fontSize:"1.2rem", color: "#E84E3F"}}>
                            Cameron Lee
                        </div>
                        <div className="indented" style={{color: "#D3D3D3", fontSize:"0.8rem"}}>
                            Front End Member, GitHub Master
                        </div>
                        <div style={{fontSize:"1.2rem", color: "#E84E3F"}}>
                            Antonio Indindoli
                        </div>
                        <div className="indented" style={{color: "#D3D3D3", fontSize:"0.8rem"}}>
                            Back End Lead
                        </div>
                        <div style={{fontSize:"1.2rem", color: "#E84E3F"}}>
                            Tommy Le
                        </div>
                        <div className="indented" style={{color: "#D3D3D3", fontSize:"0.8rem"}}>
                            Back End Member, Database Engineer
                        </div>
                        <div style={{fontSize:"1.2rem", color: "#E84E3F"}}>
                            San-yu “Sally” Peng
                        </div>
                        <div className="indented" style={{color: "#D3D3D3", fontSize:"0.8rem"}}>
                            Back End Member
                        </div>     
                    </div>
                </div>
                </div>
            </main>
    );
};