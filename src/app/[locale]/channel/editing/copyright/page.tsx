import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";

interface ICopyrightProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}:ICopyrightProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories'])
    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="w-60 bg-white border-r border-gray-200 h-screen">
                <AsideHome t={t}/>
            </div>

            <div className="flex-auto overflow-hidden pt-20">

                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold mb-6">Channel copyright</h1>

                    <div className="flex items-center space-x-4 text-sm">
                        <button className="text-gray-700 border-b-2 border-gray-900">Removal requests</button>

                    </div>
                    <button className="text-gray-700 float-right">Request removal</button>
                    <hr className="my-4 border-gray-300"/>


                    <div className="flex flex-col items-center justify-center h-96">
                        <img src="https://placehold.co/120x120" alt="No comments illustration" className="mb-4"/>
                        <p className="text-gray-500">There is nothing yet.</p>
                    </div>
                </div>

            </div>
            {/*</div>*/}
        </>
    );
}
export default channelPage;