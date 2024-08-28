import initTranslations from "@/app/i18n";
import UnlimitedScrollBlock from "@/components/pages/home/main/unlimited-scroll-block";
import {IPresentedVideo} from "@/types/video.interface";
import AsideHome from "@/components/pages/home/aside/aside";

const Home = async ({ params: { locale } }) => {
    const { t } = await initTranslations(locale, ['common', 'categories'])

    const data: IPresentedVideo[] = [
        {
            id: 1,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 2,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/RwVNbhX_fzg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA4f9qfEetuCsHgJZediQpbjD3qEw",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 3,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/KdGfhSpT6pc/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCfBm7wbYYcuPv8_2C_pFOyDLvBRA",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 4,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 5,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 6,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 7,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 8,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 9,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 10,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
    ]

  return (
      <>
          <div className="flex pt-20 overflow-hidden">
              <AsideHome t={t}/>
          </div>
          <main className="pl-[20%] max-lg:pl-[12%] max-sm:pl-0">
              <UnlimitedScrollBlock data={data}/>
          </main>
      </>
  );
}

export default Home
