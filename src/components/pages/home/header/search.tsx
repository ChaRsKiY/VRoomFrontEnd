"use client";

import React, {useEffect, useState} from 'react';
import {IoIosSearch} from "react-icons/io";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useTranslation} from "next-i18next";
import {ITranslationFunction} from "@/types/translation.interface";
import {FaMicrophone} from "react-icons/fa";

const Search: React.FC = () => {
    const { t }: { t: ITranslationFunction } = useTranslation();
    const ref = React.useRef<HTMLInputElement>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any | null>(null);

    useEffect(() => {
        // @ts-ignore
        const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';
            setRecognition(recognitionInstance);
        }
    }, []);

    useEffect(() => {
        if (recognition) {
            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
            };

            recognition.onerror = (event: any) => {
                setIsListening(false);
            };
        }
    }, [recognition]);

    const startListening = () => {
        if (isListening) {
            recognition?.stop();
            setIsListening(false);
        } else {
            recognition?.start();
            setIsListening(true);
        }
    };

    return (
        <div className="flex space-x-4 flex-1">
            <div
                className="header-search border flex-1 border-neutral-200 rounded-full relative dark:border-neutral-700">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (ref.current) {
                        window.location.href = `/results?search_query=${ref.current.value}`;
                    }
                }}>
                    <input
                        placeholder={t("search")}
                        ref={ref}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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

            {recognition && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <button
                                onClick={startListening}
                                style={isListening ? { backgroundColor: "#00A1FF" } : { }}
                                className="rounded-full bg-neutral-300 p-1.5 flex items-center aspect-[1/1] h-full justify-center duration-150 hover:bg-neutral-400 hover:cursor-pointer dark:bg-neutral-600 dark:hover:bg-neutral-500">
                                <FaMicrophone color="white"/>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t("voice_search")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
};

export default Search;