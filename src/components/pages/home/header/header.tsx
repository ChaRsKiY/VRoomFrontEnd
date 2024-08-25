import React from 'react'
import Search from "@/components/pages/home/header/search";
import HeaderBlock from "@/components/pages/home/header/header-block";
import classNames from "classnames";
import VoiceSearch from "@/components/pages/home/header/voice-search";
import BurgerMenu from "@/components/pages/home/header/burger-menu";
import TranslationsProvider from "@/components/providers/translations.provider";
import {ITranslationFunction} from "@/types/translation.interface";

const HeaderHome: React.FC = ({ t }: ITranslationFunction) => {
    return (
        <div className="flex justify-between px-[5%] py-3.5 fixed top-0 right-0 left-0 bg-white dark:bg-neutral-950">
            <div className="flex space-x-7">
                <BurgerMenu />
                <div className={classNames("font-bold self-center new-amsterdam text-3xl text-neutral-700 dark:text-white")}><span className="text-red-400">V</span>Room</div>
            </div>

            <div className="flex space-x-4 w-[50%]">
                <Search />
                <VoiceSearch t={t} />
            </div>

            <HeaderBlock />
        </div>
    )
}

export default HeaderHome