import React from "react";
import ClientHome from "@/components/pages/channel/ClientHome";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/home/aside/aside";
import {RxAvatar} from "react-icons/rx";
import Image from "next/image";
import Link from "next/link";

const channelPage = async ({params: {locale}}) => {
    const {t} = await initTranslations(locale, ['common', 'categories'])
    return (

        <>
            <div className="flex">{/* pt-20 overflow-hidden*/}
                <AsideHome t={t}/>
            </div>
            <div className="pl-[22.5%] max-lg:pl-[12%] max-sm:pl-0">
                <div className="grid pr-[2%] grid-cols-3 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">

                    <Image style={{borderRadius: '50%'}} width={110} height={110}
                           src="https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo"
                           alt="Avatar"/>
                    <div className="pl-[12.5%]">
                        <h1><strong>Mr.Beast</strong></h1>
                        <Link target={'_blank'} href={"/channel/editing"} className="space-y-2.5">Customize channel view</Link>
                        {/*<ClientHome/>*/}
                    </div>
                </div>
                <div>
                    <br/><h1 style={{'float': 'left'}}><strong>History</strong></h1><br/><br/><br/>
                    <div className="grid pr-[2%] grid-cols-3 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">

                    </div>
                </div>
                <div>
                    <br/><h1 style={{'float': 'left'}}><strong>Play Lists</strong></h1><br/><br/><br/>
                    <div className="grid pr-[2%] grid-cols-3 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">

                    </div>
                </div>
            </div>
        </>
    );
}
export default channelPage;