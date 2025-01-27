
import React from 'react'
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import HeaderHome from "@/components/pages/home/header/header";
import MainByTagInfo from '@/components/pages/home/main/mainlistbytag';
import ResultInfo from '@/components/pages/results/resultlist';
import MainByCategoryInfo from '@/components/pages/home/main/mainlistbycategory';

interface Props {
    params: {
        locale: string;
    }
}

const MainByCategoryPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
    const { t } = await initTranslations(locale, ['common', 'categories']);


    return (
        <>
            <div className="flex pt-20 overflow-hidden">
                {t && <HeaderHome t={t} />}
            </div>
            <div className="flex pt-20 overflow-hidden">
                {t && <AsideHome t={t} />}
            </div>
            <main className="pl-[20%] w-full  flex justify-center max-lg:pl-[12%] max-sm:pl-0">
                <div className='flex'>
                    <MainByCategoryInfo />

                </div>

            </main>
        </>
    )
}

export default MainByCategoryPage