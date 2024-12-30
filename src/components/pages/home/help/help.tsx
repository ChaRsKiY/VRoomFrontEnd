
import React, { useState } from "react";
import api from '@/services/axiosApi';
import Link from "next/link";
import {ITranslationFunction} from "@/types/translation.interface";

interface IHelpProps {
    t: ITranslationFunction
}

const Help: React.FC<IHelpProps> = ({t}: IHelpProps) => {


    return (

        <div style={{
            width: '100%', marginTop: '80px', padding: '50px', borderRadius: "30px",
            backgroundColor: 'white',
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            marginBottom: '50px'
        }}>

            <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", padding: "20px" }}>

                <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: '24px', fontWeight: 'bold' }}>
                {t("help:start")}
                </h1>

                <div style={{ display: "flex", justifyContent: 'space-around' }}>
                    <div style={{ maxWidth: "800px", margin: "0 auto", }}>
                        <section style={{ marginBottom: "30px" }}>
                            <ul>
                                <li >
                                    <div style={{ backgroundColor: 'white' }}>
                                           <div >
                                            <strong style={{ fontSize: '20px' }}>{t("help:1.0")}</strong> <br /><br />
                                            <p>
                                            {t("help:reg")}
                                            </p>
                                            <br />
                                            <p>
                                            {t("help:1")}
                                            </p><br />
                                            <p>
                                            {t("help:2")}
                                            </p><br />
                                            <p>
                                            {t("help:3")}
                                            </p><br />
                                            <p>
                                            {t("help:problem")} &nbsp;&nbsp;&nbsp;&nbsp;
                                                <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", color: 'royalblue' }}>
                                                    vroomteamit@gmail.com</Link>
                                            </p><br />

                                        </div>
                                    </div>
                                    <br /><br />
                                </li>
                                <li >
                                    <div style={{ backgroundColor: 'white' }}>
                                        <div  >
                                            <strong style={{ fontSize: '20px' }}> {t("help:2.0")}</strong> <br /><br />
                                            <p>
                                            {t("help:2.1")}
                                            </p>
                                            <br />
                                            <p>
                                            {t("help:2.2")}
                                            </p><br />
                                            <p>
                                            {t("help:2.3")}
                                            </p><br />
                                            <p>
                                            {t("help:2.4")}
                                            </p><br />
                                            <p>
                                            {t("help:2.01")}
                                            </p><br />
                                            <p>
                                            {t("help:problem")} &nbsp;&nbsp;&nbsp;&nbsp;
                                                <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", color: 'royalblue' }}>
                                                    vroomteamit@gmail.com</Link>
                                            </p><br />

                                        </div>
                                    </div>
                                    <br /><br />
                                </li>
                                <li>
                                    <div style={{ backgroundColor: 'white' }}>
                                        <div  >
                                            <strong style={{ fontSize: '20px' }}>{t("help:3.0")}</strong> <br /><br />
                                            <p>
                                            {t("help:3.1")}
                                            </p>
                                            <br />
                                            <p>
                                            {t("help:3.2")}
                                            </p><br />
                                            <p>
                                            {t("help:3.3")}
                                            </p><br />
                                            <p>
                                            {t("help:3.4")}
                                            </p><br />
                                            <p>
                                            {t("help:3.5")}
                                            </p><br />
                                            <p>
                                            {t("help:3.6")}
                                            </p><br />
                                            <p>
                                            {t("help:problem")} &nbsp;&nbsp;&nbsp;&nbsp;
                                                <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", color: 'royalblue'  }}>
                                                    vroomteamit@gmail.com</Link>
                                            </p><br />
                                        </div></div><br /><br />
                                </li>
                                <li>
                                    <div style={{ backgroundColor: 'white' }}>
                                        <div >
                                            <strong style={{ fontSize: '20px' }}> {t("help:4.0")}</strong> <br /><br />
                                            <p>
                                            {t("help:4.01")}
                                            </p>
                                            <br />
                                            <p>
                                            {t("help:4.1")}
                                            </p><br />
                                            <p>
                                            {t("help:4.2")}
                                            </p><br />
                                            <p>
                                            {t("help:4.3")}
                                            </p><br />
                                            <p>
                                            {t("help:problem")} &nbsp;&nbsp;&nbsp;&nbsp;
                                                <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", color: 'royalblue'  }}>
                                                    vroomteamit@gmail.com</Link>
                                            </p><br />

                                        </div></div><br /><br />
                                </li>
                                <li>
                                    <div style={{ backgroundColor: 'white' }}>
                                        <div >
                                            <strong style={{ fontSize: '20px' }}> {t("help:5.0")}</strong> <br /><br />
                                            <p>
                                            {t("help:5.01")}
                                            </p>
                                            <br />
                                            <p>
                                            {t("help:5.1")}
                                            </p><br />
                                            <p>
                                            {t("help:5.2")}
                                            </p><br />
                                            <p>
                                            {t("help:5.3")}
                                            </p><br />
                                            <p>
                                            {t("help:5.02")} &nbsp;&nbsp;&nbsp;&nbsp;
                                                <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", color: 'royalblue'  }}>
                                                    vroomteamit@gmail.com</Link>
                                            </p><br />

                                        </div></div><br /><br />
                                </li>
                                <li>
                                    <div style={{ backgroundColor: 'white' }}>
                                        <div  >
                                            <strong style={{ fontSize: '20px' }}> {t("help:6.0")}</strong> <br /><br />
                                            <p>
                                            {t("help:6.1")}
                                            </p>
                                            <br />
                                            <p>
                                            {t("help:6.2")}
                                            </p><br />
                                            <p>
                                            {t("help:6.3")}
                                            </p><br />
                                            <p>
                                               {t("help:6.4")}
                                            </p><br />
                                            <p>
                                            {t("help:6.5")}
                                            </p><br />

                                        </div></div><br /><br />
                                </li>
                                <li>
                                    <div style={{ backgroundColor: 'white' }}>
                                        <div  >
                                            <strong style={{ fontSize: '20px' }}> {t("help:7.0")}</strong> <br /><br />
                                            <p>
                                            {t("help:7.1")}
                                            </p>
                                            <br />
                                            <p>
                                            {t("help:7.2")}
                                            </p><br />
                                            <p>
                                            {t("help:7.3")}
                                            </p><br />
                                            <p>
                                            {t("help:7.01")}
                                            </p><br />

                                        </div></div><br /><br />
                                </li>
                                <div style={{ backgroundColor: 'white' }}>
                                    <div >
                                        <li>

                                            <strong style={{ fontSize: '20px' }}>{t("help:8")}</strong> <br /><br />

                                            <ul>
                                                <li>Email: vroomteamit@gmail.com</li>
                                                <li> {t("help:telephone")} +38 (097) 123-45-67</li>
                                                <li> {t("help:hour")} 9:00 - 18:00</li>
                                                <br/>
                                            </ul>
                                        </li>
                                    </div></div>
                            </ul>

                        </section>
                    </div>
                </div>
            </div>

        </div>
       
    );
}
export default Help;