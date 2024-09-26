import React from 'react'
import CommentsPostBlock from "@/components/pages/posts/commentsblock";
import HeaderHome from "@/components/pages/home/header/header";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/home/aside/aside";
import Post from "@/components/pages/posts/onepost"

const CommentsPostPage: React.FC = async ({ params }: any) => {
    
    const { id } = params;
    const { t } = await initTranslations(params.locale, ['common', 'categories'])
      
    

    return (
        <div className="flex w-full mt-20" >
            <HeaderHome t={t}/>
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
            </div>
            <div className="pl-[20%] w-3/4   max-lg:pl-[12%] max-sm:pl-0">
                <Post postid={id} />
                <CommentsPostBlock  postid={id} />
            </div>
            <div>

            </div>
        </div>
    )
}

export default CommentsPostPage