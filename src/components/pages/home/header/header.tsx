import React from 'react'
import Search from "@/components/pages/home/header/search";
import HeaderBlock from "@/components/pages/home/header/header-block";
import {ITranslationFunction} from "@/types/translation.interface";
import Image from "next/image";
import Link from "next/link";

interface IHeaderHomeProps {
    t: ITranslationFunction
}

const HeaderHome: React.FC<IHeaderHomeProps> = ({ t }: IHeaderHomeProps) => {
    return (
        <div className="flex justify-between px-[5%] py-3.5 fixed top-0 right-0 left-0 bg-white dark:bg-neutral-950 z-40 max-lg:py-3 max-lg:px-[3%]">
            <Link href="/">
                <Image src="/logo.svg" alt="logo" width={125} height={125} />
            </Link>

            <div className="flex space-x-4 w-[50%] max-lg:w-[30%] max-lg:space-x-3 max-lg:flex-1 max-lg:px-[10%] max-[520px]:hidden">
                <Search />
            </div>

            <HeaderBlock />
        </div>
    )
};

export default HeaderHome;
