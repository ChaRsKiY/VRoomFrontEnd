import initTranslations from "@/app/i18n";
import UnlimitedScrollBlock from "@/components/pages/home/main/unlimited-scroll-block";
import AsideHome from "@/components/pages/home/aside/aside";
import React from "react";
import {data} from "@/testdata/videos";

const Home = async ({ params: { locale } }: { params: { locale: string } }) => {
    // @ts-ignore
    const { t } = await initTranslations(locale, ['common', 'categories'])

  return (
      <>
          <div className="flex pt-20 overflow-hidden">
              <AsideHome t={t}/>
          </div>
          <main className="pl-[18%] max-lg:pl-[12%] max-sm:pl-0">
              <UnlimitedScrollBlock data={data}/>
          </main>
      </>
  );
}

export default Home
