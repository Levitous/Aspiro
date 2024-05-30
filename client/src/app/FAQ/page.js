import TitleBox from "../../components/titlebox";

export default function aboutAspiro () {
    return (
        <main >
            <TitleBox value={"Frequently Asked Questions"}/>
            <div style={{
                background:"var(--blackIce)",
                padding:"1rem",
                margin:"0 5% 1rem 5%",
                borderRadius:"1rem",
                border:"1px solid black"     
            }}>
                <div style={{display:"flex", 
                            flexDirection:"column"}}>
                    <div style={{fontSize:"1.2rem"}}>
                    Q: How does Aspiro rank Schools?
                    </div>
                    <div style={{fontSize:"1.2rem"}}>
                    A: Team Six developed a proprietary ranking algorithm based on the following:
                    </div>
                    <div className="indented">
                    Level of Awards:
                        <div className="indented">
                        If an Olympian simply participated in the Olympics, they receive a
                        starting score of 1. Each step up in awards (bronze, silver, gold)
                        adds to this score by one.
                        </div>
                    </div>
                    <div className="indented">
                    Recency of Awards:
                        <div className="indented">
                        This starting score of 1 through 4 is adjusted based on a exponentially decaying 
                        modifier. The further back in time an award was won, the less this score contributes
                        to an overall score. In this way, we avoid being entrenched in the past and
                        reward up-and-coming schools for their progress in developing Olympic level athletes.
                        </div>
                    </div>
                    <div className="linebreak" style={{fontSize:"1.2rem"}}>
                    Q: Who is Team Six?
                    </div>
                    <div className="indented">
                    Team Six is a group of San Francisco State University students
                    participating in a Software Engineering course. You can find our
                    About page in the information dropdown above, or by clicking Team Six
                    in the footer.
                    </div>
                </div>
            </div>
        </main>
    );
};