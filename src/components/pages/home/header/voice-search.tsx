import React from 'react'
import {FaMicrophone} from "react-icons/fa";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ITranslationFunction} from "@/types/translation.interface";

const VoiceSearch: React.FC = ({ t }: ITranslationFunction) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        className="rounded-full bg-neutral-400 p-1.5 flex items-center aspect-[1/1] h-full justify-center duration-150 hover:bg-neutral-500 hover:cursor-pointer dark:bg-neutral-600 dark:hover:bg-neutral-500">
                        <FaMicrophone color="white"/>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t("voice_search")}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default VoiceSearch