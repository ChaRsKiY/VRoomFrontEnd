"use client"

import {useEffect, useState} from "react";
import ChartAnalytics, {AnalyticData, dateToMonth, dateToWeek} from "@/components/pages/admin/chart";
import {RangeDate} from "@/components/pages/admin/registration-summary-chart";
import api from "@/services/axiosApi";
import {useTranslation} from "next-i18next";

const VideoViewDuration = ({ channelId }: { channelId: number }) => {
    const [data, setData] = useState<AnalyticData[]>([]);
    const [rangeDate, setRangeDate] = useState<RangeDate>({
        start: null,
        end: null
    });
    const [range, setRange] = useState("year");

    const { t } = useTranslation()

    const fetchData = async () => {
        try {
            const response = await api.get("/AnalyticVRoom/getdurationviewallvideobychannelbydiapason/" + range + "/" + channelId);
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
            const response = await api.get("/AnalyticVRoom/getdurationviewallvideobychannelbydates/" + rangeDate?.start?.toISOString() + "/" + rangeDate?.end?.toISOString()  + "/" + channelId);
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
        <ChartAnalytics rangeDate={rangeDate} setRangeDate={setRangeDate} chartTitle={t("admin-main:view-duration-by-channel.json")} chartDescription={t("admin-main:view-duration-summary-channel.json")} data={data} dataKey="count" range={range} setRange={setRange} />
    )
}

export default VideoViewDuration;