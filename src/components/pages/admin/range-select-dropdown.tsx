import React from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {MdAccessTimeFilled} from "react-icons/md";
import {RangeDate} from "@/components/pages/admin/registration-summary-chart";
import {useTranslation} from "next-i18next";

interface Props {
    currentRange: string;
    setCurrentRange: (range: string) => void;
    rangeDate: RangeDate | null;
}

const RangeSelectDropdown = ({ currentRange, setCurrentRange, rangeDate }: Props) => {
    const hasRange = (rangeDate?.start !== null) && (rangeDate?.end !== null);

    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button disabled={hasRange} variant="outline"><MdAccessTimeFilled size={18} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2">
                <DropdownMenuItem onClick={() => setCurrentRange('year')} className={currentRange === 'year' ? 'bg-neutral-100 dark:bg-neutral-700' : ''}>{t("admin-main:year")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentRange('month')} className={currentRange === 'month' ? 'bg-neutral-100 dark:bg-neutral-700' : ''}>{t("admin-main:month")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentRange('week')} className={currentRange === 'week' ? 'bg-neutral-100 dark:bg-neutral-700' : ''}>{t("admin-main:week")}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default RangeSelectDropdown