import initTranslations from "@/app/i18n";
import UnlimitedScrollBlock from "@/components/pages/home/main/unlimited-scroll-block";
import AsideHome from "@/components/pages/home/aside/aside";
import {data} from "@/testdata/videos";

interface IHomeProps {
    params: {
        locale: string;
    }
}

const Home = async ({ params: { locale } }: IHomeProps) => {
    const { t } = await initTranslations(locale, ['common', 'categories'])

  return (
      <>
          <div className="flex pt-20 overflow-hidden">{/**/}
              <AsideHome t={t}/>
          </div>
          <main className="pl-[20%] max-lg:pl-[12%] max-sm:pl-0">
              <UnlimitedScrollBlock data={data}/>
          </main>
      </>
  );
}

export default Home
