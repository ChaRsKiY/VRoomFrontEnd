import React from 'react'
import CreatePost from "@/components/pages/posts/createpost";
import HeaderHome from "@/components/pages/home/header/header";
import initTranslations from "@/app/i18n";

const CreatePostPage: React.FC = async ({ params }: any) => {
    

    const { t } = await initTranslations(params.locale, ['common', 'categories'])

    

    return (
        <div className="flex w-full mt-20">
            <HeaderHome t={t}/>
            <div className="w-3/4 px-8">
                <CreatePost  id={1}/>
            </div>
            <div>

            </div>
        </div>
    )
}

export default CreatePostPage