"use client"

import React, {useEffect, useState} from 'react'
import ChartAnalytics, {AnalyticData, dateToMonth, dateToWeek} from "@/components/pages/admin/chart";
import api from "@/services/axiosApi";
import {useTranslation} from "next-i18next";

export interface RangeDate {
    start: Date | null;
    end: Date | null;
}

const RegistrationSummaryChart: React.FC = () => {
    const [data, setData] = useState<AnalyticData[]>([]);
    const [rangeDate, setRangeDate] = useState<RangeDate>({
        start: null,
        end: null
    });
    const [range, setRange] = useState("year");

    const { t } = useTranslation();

    const fetchData = async () => {
        try {
            const response = await api.get("/AnalyticVRoom/getusersregistrations/" + range);
            setData(response.data.map((item: any) => ({
                month: range === "year" ? dateToMonth(item.date) : dateToWeek(item.date),
                count: item.count
            })));
        } catch (e) {
            console.error(e);
        }
    }

    const fetchDataByRange = async () => {
        try {
            const response = await api.get("/AnalyticVRoom/getusersregistrationsbydays/" + rangeDate?.start?.toISOString() + "/" + rangeDate?.end?.toISOString());
            setData(response.data.map((item: any) => ({
                month: range === "year" ? dateToMonth(item.date) : dateToWeek(item.date),
                count: item.count
            })));
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [range]);

    useEffect(() => {
        if (rangeDate?.start && rangeDate?.end) {
            fetchDataByRange();
        } else {
            fetchData();
        }
    }, [rangeDate]);

    return (
        <ChartAnalytics rangeDate={rangeDate} setRangeDate={setRangeDate} chartTitle={t("admin-main:registrations")} chartDescription={t("admin-main:summary-registrations")} data={data} dataKey="count" range={range} setRange={setRange} />
    )
}

export default RegistrationSummaryChart