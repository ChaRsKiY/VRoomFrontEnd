import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import Post from "@/components/pages/posts/postonchannel";
import CommentsPostBlock from "@/components/pages/posts/commentsblock";



const channelPage = async ({ params }: any) => {
    const { id } = params;
    const { t } = await initTranslations( params.locale, ['common', 'categories'])
    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t} />
            </div>
            <div className="w-52 bg-white border-r border-gray-200 h-screen overflow-hidden ">
                <AsideHome t={t} />
            </div>
            <div className="pl-[10%] w-3/4   max-lg:pl-[12%] max-sm:pl-0">
            <div  style={{border:'1px solid lightgray', padding:'15px',borderRadius:'20px',marginTop:'80px'}}>
                <Post postid={id} />
                <div style={{paddingLeft:'50px',paddingRight:'50px'}}>
                <CommentsPostBlock  postid={id} />
                </div>
            </div>
            </div>
            </>
    );
}
export default channelPage;