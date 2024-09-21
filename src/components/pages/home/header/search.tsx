"use client";

import React from 'react';
import {IoIosSearch} from "react-icons/io";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useTranslation} from "next-i18next";
import {ITranslationFunction} from "@/types/translation.interface";
import Link from "next/link";

const Search: React.FC = () => {
    const { t }: { t: ITranslationFunction } = useTranslation();
    const ref = React.useRef<HTMLInputElement>(null);

    return (
        <div className="header-search flex-1 border border-neutral-200 rounded-full relative dark:border-neutral-700">
            <form onSubmit={(e) => {
                e.preventDefault();
                if (ref.current) {
                    window.location.href = `/results?search_query=${ref.current.value}`;
                }
            }}>
                <input
                    placeholder={t("search")}
                    ref={ref}
                    className="rounded-full px-3 relative pr-14 outline-blue h-9 w-full dark:bg-neutral-900 dark:outline-0"
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="absolute right-0" type="submit">
                            <div className="header-search-icon bg-blue rounded-full py-2 px-2 hover:cursor-pointer">
                                <IoIosSearch color="white" size={20}/>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t("search")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </form>
        </div>
    );
};

export default Search;