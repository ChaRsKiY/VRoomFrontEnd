import React from 'react'
import Search from "@/components/pages/home/header/search";
import HeaderBlock from "@/components/pages/home/header/header-block";
import VoiceSearch from "@/components/pages/home/header/voice-search";
import BurgerMenu from "@/components/pages/home/header/burger-menu";
import {ITranslationFunction} from "@/types/translation.interface";
import Image from "next/image";
import Link from "next/link";

const HeaderHome: React.FC = ({ t }: ITranslationFunction) => {
    return (
        <div className="flex justify-between px-[5%] py-3.5 fixed top-0 right-0 left-0 bg-white dark:bg-neutral-950">
            <div className="flex space-x-7">
                <BurgerMenu />
                <Link href="/">
                    <Image src="/logo.svg" alt="logo" width={125} height={125} />
                </Link>
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