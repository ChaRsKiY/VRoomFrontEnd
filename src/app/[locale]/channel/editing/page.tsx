// 'use client'
import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import Link from "next/link";


interface IChannelEditProps {
    params: { locale: string; }
}

const channelPage: React.FC<IChannelEditProps> = async ({params: {locale}}: IChannelEditProps) => {
    const {t} = await initTranslations(locale, ['common', 'channel']);


    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="flex">
                {t && <AsideHome t={t}/>}
            </div>
            <div className="pl-[22.5%] max-lg:pl-[12%] max-sm:pl-0 pt-20">

                <div>
                    <br/><h1 style={{'float': 'left'}} className="text-[1.4rem]"><strong>Channel control panel</strong>
                </h1><br/><br/><br/>
                    <div className="grid pr-[-3%] grid-cols-2 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
                        <div>
                            <p style={{textAlign: 'center', wordWrap: 'normal', width: '340px'}}>Here you will see the
                                metrics of the video that you upload last.
                                To add a video, click the button below.</p><br/>
                            <Link href={"/channel/detailvideo"}
                                  role="button"
                                  style={{
                                      display: 'block',
                                      borderRadius: '20px',
                                      background: 'black',
                                      color: 'white',
                                      padding: '5px 15px',
                                      margin: '5px auto 5px auto',
                                      textAlign: 'center',
                                      zIndex: 10
                                  }} className={'block '}
                                  target={'_self'}
                            >Add video
                            </Link><br/>
    <Link 
        href="/channel/updatevideo" // Замінив на реальну сторінку для редагування відео
        role="button"
        style={{
            display: 'block',
            borderRadius: '20px',
            background: 'black',
            color: 'white',
            padding: '5px 15px', // Більше відступів для кращого вигляду
            margin: '10px auto',
            textAlign: 'center',
            zIndex: 10,
            transition: 'background-color 0.3s ease', // Додав анімацію для змінення фону
        }}
        className="block hover:bg-gray-800" // Додав hover ефект
        target="_self"
    >
        Edit video
    </Link>
                        </div>
                        
                        <div className="ml-16">
                            <h1 className="text-[1.3rem]"><strong>Channel analytics</strong></h1>
                            <h5 className="text-[1.0rem]">Subscriptions</h5>
                            <h2 className="text-[1.3rem]"><strong>0</strong></h2>
                            <br/><br/><h5 className="text-[1.0rem]"><strong>Summary data</strong></h5>
                            <h5 className="text-[1.0rem]">Last 28 days</h5><br/>
                            <div>
                                <h5 className="text-[1.0rem]" style={{width: 'max-content', float: 'left'}}>Views</h5>
                                <h5 className="text-[1.0rem]" style={{width: 'max-content', float: 'right'}}>0 - </h5>
                            </div>
                            <br/><br/>
                            <div>
                                <h5 className="text-[1.0rem]" style={{width: 'max-content', float: 'left'}}>Watching
                                    time (hours)</h5>
                                <h5 className="text-[1.0rem]" style={{width: 'max-content', float: 'right'}}>0,0 - </h5>
                            </div>

                            <br/><br/><h5 className="text-[1.0rem]"><strong>Top videos</strong></h5>
                            <h5 className="text-[1.0rem]">Last 48 hours. Views</h5>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
export default channelPage;