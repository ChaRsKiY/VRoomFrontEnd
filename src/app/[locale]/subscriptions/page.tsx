import React  from 'react'
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import HeaderHome from "@/components/pages/home/header/header";
import AllSubscriptionsComponent from "@/components/pages/subscriptions/allsubscriptions"

interface Props {
    params: {
        locale: string;
    }
}

const ResultsPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
    const { t } = await initTranslations(locale, ['common', 'categories']);
     

    return (
        <div>
            <HeaderHome t={t}/>
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
            </div>
            
               <AllSubscriptionsComponent  />
          
        </div>
    )
}

export default ResultsPage