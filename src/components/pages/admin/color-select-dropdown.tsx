import React from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {IoIosColorPalette} from "react-icons/io";
import {Label} from "@/components/ui/label";
import {useTranslation} from "next-i18next";

interface Props {
    color: string;
    setColor: (color: string) => void;
}

const ColorSelectDropdown = ({ color, setColor }: Props) => {
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><IoIosColorPalette size={18} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5">
                <Label className="pl-2">{t("admin-main:choose-chart-color")}</Label>
                <div className="grid grid-cols-5 gap-4 pt-3">
                    <button
                        className="h-[40px] w-[40px] rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
                        onClick={() => setColor('auto')}
                    ></button>
                    <button className="h-[40px] w-[40px] rounded-full bg-red-500" onClick={() => setColor('rgb(239 68 68)')}></button>
                    <button className="h-[40px] w-[40px] rounded-full bg-blue-500" onClick={() => setColor('rgb(59 130 246)')}></button>
                    <button className="h-[40px] w-[40px] rounded-full bg-green-500" onClick={() => setColor('rgb(34 197 94)')}></button>
                    <button className="h-[40px] w-[40px] rounded-full bg-yellow-500" onClick={() => setColor('rgb(234 179 8)')}></button>
                    <button className="h-[40px] w-[40px] rounded-full bg-purple-500" onClick={() => setColor('rgb(168 85 247)')}></button>
                    <button className="h-[40px] w-[40px] rounded-full bg-pink-500" onClick={() => setColor('rgb(236 72 153)')}></button>
                    <button className="h-[40px] w-[40px] rounded-full bg-orange-500" onClick={() => setColor('rgb(249 115 22)')}></button>
                    <button className="h-[40px] w-[40px] rounded-full bg-teal-500" onClick={() => setColor('rgb(20 184 166)')}></button>
                    <button className="h-[40px] w-[40px] rounded-full bg-gray-500" onClick={() => setColor('rgb(107 114 128)')}></button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ColorSelectDropdown