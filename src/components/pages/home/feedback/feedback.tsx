
import React from "react";
import EmailForm from "./emailform";
import {ITranslationFunction} from "@/types/translation.interface";

interface IFeedbackProps {
    t: ITranslationFunction
}

const FeedbackComponent: React.FC<IFeedbackProps> = ({t}: IFeedbackProps)  => {

    return (

        <div style={{
            width: '100%', marginTop: '80px', padding: '50px', borderRadius: "50px",minWidth:'700px',
            backgroundColor: 'white',
             boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            marginBottom:'50px'
        }}>

            <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", padding: "20px" }}>

                <div style={{ display: "flex", justifyContent: 'space-around' }}>
                    <div style={{ maxWidth: "800px",minWidth:'600px', margin: "0 auto", }}>
                    <section style={{ marginBottom: "30px" }}>
                            <h2 style={{fontSize:'18px',fontWeight:'bold',}}>{t("help:contact")}</h2>
                           
                            <ul>
                                <li>Email: vroomteamit@gmail.com</li>
                                <li>{t("help:telephone")}  +38 (097) 123-45-67</li>
                                <li>{t("help:hour")}  9:00 - 18:00</li>
                            </ul>
                        </section>
                        <section style={{ marginBottom: "10px" }}>
                            <p style={{fontSize:'18px',fontWeight:'bold',}}>
                            {t("help:connect")}
                            </p>
                        </section>

                    <EmailForm fill= {t("help:fill")} name= {t("help:name")} email={t("help:email")}
                     enterN={t("help:enterN")}  enterE={t("help:enterE")} send={t("help:send")}
                     mess={t("help:mess")} about={t("help:about")}/>
                      
                    </div>
                </div>
            </div>

        </div>
    );
}
export default FeedbackComponent;