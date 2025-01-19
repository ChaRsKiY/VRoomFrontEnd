import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/home/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import PlaylistContent from "@/app/[locale]/channel/playlist/playlist";

interface IPlaylistPageProps {
    params: { locale: string; }
}

const PlaylistPage = async ({params: {locale}}: IPlaylistPageProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories']);

    return (
        <>
            <HeaderHome t={t}/>
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
                <div className="pl-[20%] max-lg:pl-[12%] max-sm:pl-0 pt-20">
                    <PlaylistContent />
                </div>
            </div>
        </>
    );
}

export default PlaylistPage;