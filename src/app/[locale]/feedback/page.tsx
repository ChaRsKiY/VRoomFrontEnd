import React from 'react'
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import HeaderHome from "@/components/pages/home/header/header";
import FeedbackComponent from "@/components/pages/home/feedback/feedback";

interface Props {
    params: {
        locale: string;
    }
}

const FeedbackPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
    const { t } = await initTranslations(locale, ['help','common', 'categories']);


    return (
        <>
            <HeaderHome t={t} />
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t} />
            </div>
            <main className="pl-[20%] w-full  flex justify-center max-lg:pl-[12%] max-sm:pl-0"
            >
                <div className='flex' style={{
                    backgroundImage: `url(/terms_light.jpg)`,
                    padding: "50px", paddingLeft: "200px", paddingRight: "200px", 
                }}  >
                    <FeedbackComponent  t={t} />

                </div>

            </main>
        </>
    )
}

export default FeedbackPage