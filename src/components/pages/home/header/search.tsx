"use client"

import React from 'react'
import {IoIosSearch} from "react-icons/io";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useTranslation} from "next-i18next";
import {ITranslationFunction} from "@/types/translation.interface";

const Search: React.FC = () => {
    const { t }: ITranslationFunction = useTranslation()

    return (
        <div className="header-search flex-1 border border-neutral-300 rounded-full relative dark:border-neutral-700">
            <input
                placeholder={t("search")}
                onChange={() => {}}
                className="rounded-full px-3 relative pr-14 outline-red-400 h-9 w-full dark:bg-neutral-900 dark:outline-0"
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="absolute right-0">
                        <div className="header-search-icon bg-red-400 rounded-full py-2 px-2 hover:cursor-pointer">
                            <IoIosSearch color="white" size={20}/>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("search")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export default Search