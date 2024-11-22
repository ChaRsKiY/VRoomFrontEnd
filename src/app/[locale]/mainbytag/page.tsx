
import React from 'react'
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import HeaderHome from "@/components/pages/home/header/header";
import MainByTagInfo from '@/components/pages/home/main/mainlistbytag';

interface Props {
    params: {
        locale: string;
    }
}

const MainByTagPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
    const { t } = await initTranslations(locale, ['common', 'categories','tagname']);


    return (
        <>
            <div className="flex pt-20 overflow-hidden">
                {t && <HeaderHome t={t} />}
            </div>
            <div className="flex pt-20 overflow-hidden">
                {t && <AsideHome t={t} />}
            </div>
            <main className="pl-[20%] w-full  flex justify-center max-lg:pl-[12%] max-sm:pl-0">
                <MainByTagInfo />

            </main>
        </>
    )
}

export default MainByTagPage