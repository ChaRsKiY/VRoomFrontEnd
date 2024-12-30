"use client"

import React, {useEffect, useState} from 'react'
import ChartAnalytics, {AnalyticData, dateToMonth, dateToWeek} from "@/components/pages/admin/chart";
import api from "@/services/axiosApi";
import {RangeDate} from "@/components/pages/admin/registration-summary-chart";
import {useTranslation} from "next-i18next";

const DurationAllViewVideoChart: React.FC = () => {
    const [data, setData] = useState<AnalyticData[]>([]);
    const [rangeDate, setRangeDate] = useState<RangeDate>({
        start: null,
        end: null
    });
    const [range, setRange] = useState("year");

    const { t } = useTranslation()

    const fetchData = async () => {
        try {
            const response = await api.get("/AnalyticVRoom/getdurationviewallvideobydiapason/" + range);
            setData(response.data.map((item: any) => ({
                month: range === "year" ? dateToMonth(item.date) : dateToWeek(item.date),
                count: item.count
            })));
        } catch (e: any) {
            if (e.response.status === 404) {
                setData([]);
            } else {
                console.error(e);
            }
        }
    }

    const fetchDataByRange = async () => {
        try {
            const response = await api.get("/AnalyticVRoom/getdurationviewallvideobydates/" + rangeDate?.start?.toISOString() + "/" + rangeDate?.end?.toISOString());
            setData(response.data.map((item: any) => ({
                month: range === "year" ? dateToMonth(item.date) : dateToWeek(item.date),
                count: item.count
            })));
        } catch (e: any) {
            if (e.response.status === 404) {
                setData([]);
            } else {
                console.error(e);
            }
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
        <ChartAnalytics rangeDate={rangeDate} setRangeDate={setRangeDate} chartTitle={t("admin-main:video-watch-duration")} chartDescription={t("admin-main:summary-video-watch-duration")} data={data} dataKey="count" range={range} setRange={setRange} />
    )
}

export default DurationAllViewVideoChart