import React from "react";
import Image from "next/image";
import Link from "next/link";
import initTranslations from "@/app/i18n";

interface Props {
    params: {
        locale: string;
    }
}

const termsPage: React.FC<Props> = async({ params: { locale } }: Props) => {

     const { t } = await initTranslations(locale, ['terms'])

    return (

        <div style={{
            width: '100%', backgroundImage: `url(/terms_light.jpg)`,
            height: "100%", 
        }}>
            <div className="pt-4" style={{paddingLeft:'20px'}}> <Link href="/">
                <Image src="/logo.svg" alt="logo" width={125} height={125} style={{paddingLeft:'20px'}}></Image>
            </Link></div>
            <div style={{
                display: 'flex', width: '100%', justifyContent: 'space-around',
              //  background: 'linear-gradient( to bottom right, rgba(0, 128, 0, 0.1),  rgba(0, 128, 255, 0.2) )',
                height: "100%"
            }}>
                <div className="bg-white dark:bg-neutral-900" style={{
                    width: "1000px", marginTop: '10px', padding: '50px', borderRadius: "50px", marginBottom: "100px",  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                }}>
                    <h1 style={{ fontSize: '24px', textAlign: 'center' }}>{t("terms:welcome")}</h1>
                    <br />
                    <p>
                    {t("terms:hope")}
                    </p>
                  
                    <br /><br />
                    <h2 style={{ fontSize: '20px', }}>{t("terms:one")}</h2>
                    <br />
                    <p>{t("terms:1.1")}</p>
                    <br />
                    <p>{t("terms:1.2")}</p>
                    <br />
                    <p>{t("terms:1.3")}</p>
                    <br /><br />
                    <h2 style={{ fontSize: '20px', }}>{t("terms:2")}</h2>
                    <br />
                    <p>{t("terms:2.1")}</p>
                    <br />
                    <p>{t("terms:2.2")}</p>
                    <br />
                    <p>{t("terms:2.3")}</p>
                    <br /><br />
                    <h2 style={{ fontSize: '20px', }}>{t("terms:3")}</h2>
                    <br />
                    <p>{t("terms:3.1")}</p>
                    <br />
                    <p>{t("terms:3.2")}</p>
                    <br />
                    <p>{t("terms:3.3")}</p>
                    <br /><br />
                    <h2 style={{ fontSize: '20px', }}>{t("terms:4")}</h2>
                    <br />
                    <p>{t("terms:4.1")}</p>
                    <br />
                    <p>{t("terms:4.2")}</p>
                    <br /><br />
                    <h2 style={{ fontSize: '20px', }}>{t("terms:5")}</h2>
                    <br />
                    <p>{t("terms:5.1")}</p>
                    <br />
                    <p>{t("terms:5.2")}</p>
                    <br /><br />
                    <h2 style={{ fontSize: '20px', }}>{t("terms:6")}</h2>
                    <br />
                    <p>{t("terms:6.1")}</p>
                    <br />
                    <p>{t("terms:6.2")}</p>
                    <br /><br />
                    <h2 style={{ fontSize: '20px', }}>{t("terms:7")}</h2>
                    <br />
                    <p>{t("terms:ques")}</p>
                    <br />
                    <p> &nbsp;&nbsp;&nbsp;&nbsp;Email: vroomteamit@gmail.com</p>

                    <p> &nbsp;&nbsp;&nbsp;&nbsp;+38 (097) 123-45-67</p><br />
                    <br /><br />
                    <h2 style={{ fontSize: '20px', }}>{t("terms:8")}</h2>
                    <br />
                    <p>{t("terms:end")}</p>
                    <br />
                </div>
            </div>

        </div>
    );
}
export default termsPage;