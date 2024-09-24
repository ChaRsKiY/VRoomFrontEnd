"use client"

import * as React from "react"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useState} from "react";
import {HiMiniLanguage} from "react-icons/hi2";

const languages = [
    {
        value: "ru",
        label: "Russian",
    },
    {
        value: "en",
        label: "English",
    },
    {
        value: "de",
        label: "German",
    },
]

export function LanguagePicker({ handleLanguageChange, currentLanguage }: any) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-[0.5rem] flex items-center p-2 text-[1.075rem] space-x-3">
                    <HiMiniLanguage size={23}/>
                    <div>{`Language: ${languages.filter(el => el.value === currentLanguage)[0]?.label}`}</div>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search language..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No languages found.</CommandEmpty>
                        <CommandGroup>
                            {languages.map((language) => (
                                <CommandItem
                                    key={language.value}
                                    value={language.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                        handleLanguageChange(currentValue)
                                    }}
                                >
                                    {language.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === language.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
