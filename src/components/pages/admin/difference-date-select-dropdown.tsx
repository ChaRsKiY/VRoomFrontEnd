"use client"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {MdDateRange} from "react-icons/md";
import {RangeDate} from "@/components/pages/admin/registration-summary-chart";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {cn} from "@/lib/utils";
import {CalendarIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {Label} from "@/components/ui/label";

interface Props {
    date?: RangeDate | null;
    setDate?: (date: RangeDate) => void;
}

const DifferenceDateSelectDropdown = ({ date, setDate }: Props) => {
    const handleSelectStartDate = (d: Date | undefined) => {
        if (!setDate) return;
        if (!d) {
            setDate({ start: null, end: date ? date.end : null  });
        } else {
            setDate({ start: d, end: date ? date.end : null });
        }
    }

    const handleSelectEndDate = (d: Date | undefined) => {
        if (!setDate) return;
        if (!d) {
            setDate({ start: date ? date.start : null, end: null });
        } else {
            setDate({ start: date ? date.start : null, end: d });
        }
    }

    const handleClear = () => {
        if (!setDate) return;
        setDate({ start: null, end: null });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><MdDateRange size={18} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 space-y-3">
                <div className="flex flex-col space-y-1">
                    <Label>Start Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon/>
                                {date ? format(date.start || new Date(), "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date?.start || undefined}
                                onSelect={handleSelectStartDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col space-y-1">
                    <Label>End Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon/>
                                {date ? format(date.end || new Date(), "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date?.end || undefined}
                                onSelect={handleSelectEndDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Button onClick={handleClear} className="w-full">Clear</Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DifferenceDateSelectDropdown