
import React, {Suspense} from 'react'
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/home/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import MainInfo from "@/components/pages/home/main/mainlist"
import LocalLoader from "@/components/reusable/local-loader";


interface Props {
    params: {
        locale: string;
    }
}

const Home: React.FC<Props> = async ({ params: { locale } }: Props) => {

    const { t } = await initTranslations(locale, ['common', 'categories','tagname','channel']);

    return (
        <>
            <div className="flex pt-20 overflow-hidden">
                {t && <HeaderHome t={t} />}
            </div>
            <div className="flex pt-20 overflow-hidden">
                {t && <AsideHome t={t} />}
            </div>
            <main className="pl-[20%] w-full  flex justify-center max-lg:pl-[12%] max-sm:pl-0">
                <Suspense fallback={<LocalLoader />}>
                    <MainInfo />
                </Suspense>
            </main>
        </>
    );
};

export default Home;