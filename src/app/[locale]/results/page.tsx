// import React from 'react'
// import AsideHome from "@/components/pages/home/aside/aside";
// import initTranslations from "@/app/i18n";
// import {data} from "@/testdata/videos";
// import UnlimitedScrollBlock from "@/components/pages/results/unlimited-scroll-block";
// import HeaderHome from "@/components/pages/home/header/header";

// interface Props {
//     params: {
//         locale: string;
//     }
// }

// const ResultsPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
//     const { t } = await initTranslations(locale, ['common', 'categories'])

//     return (
//         <>
//             <HeaderHome t={t}/>
//             <div className="flex pt-20 overflow-hidden">
//                 <AsideHome t={t}/>
//             </div>
//             <main className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
//                 <UnlimitedScrollBlock data={data} />
//             </main>
//         </>
//     )
// }

// export default ResultsPage


import React  from 'react'
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import HeaderHome from "@/components/pages/home/header/header";
import ResultInfo from "@/components/pages/results/resultlist";

interface Props {
    params: {
        locale: string;
    }
}

const ResultsPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
    const { t } = await initTranslations(locale, ['common', 'categories']);
     

    return (
        <>
            <HeaderHome t={t}/>
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
            </div>
            <main className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
                <ResultInfo  />
               
            </main>
        </>
    )
}

export default ResultsPage
