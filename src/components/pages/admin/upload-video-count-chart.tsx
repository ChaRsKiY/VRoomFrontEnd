"use client"

import React, {useEffect, useState} from 'react'
import ChartAnalytics, {AnalyticData, dateToMonth, dateToWeek} from "@/components/pages/admin/chart";
import api from "@/services/axiosApi";
import {RangeDate} from "@/components/pages/admin/registration-summary-chart";
import {useTranslation} from "next-i18next";
import {useAuth} from "@clerk/nextjs";

const UploadVideoCountChart: React.FC = () => {
    const [data, setData] = useState<AnalyticData[]>([]);
    const [rangeDate, setRangeDate] = useState<RangeDate>({
        start: null,
        end: null
    });
    const [range, setRange] = useState("year");

    const { getToken } = useAuth();

    const { t } = useTranslation()

    const fetchData = async () => {
        try {
            const response = await api.get("/AnalyticVRoom/getuploadvideoscount/" + range, {
                headers: {
                    "Authorization": `Bearer ${await getToken()}`
                }
            });
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
            const response = await api.get("/AnalyticVRoom/getuploadvideoscountbydays/" + rangeDate?.start?.toISOString() + "/" + rangeDate?.end?.toISOString(), {
                headers: {
                    "Authorization": `Bearer ${await getToken()}`
                }
            });
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
        <ChartAnalytics rangeDate={rangeDate} setRangeDate={setRangeDate} chartTitle={t("admin-main:video-uploads")} chartDescription={t("admin-main:summary-video-uploads")} data={data} dataKey="count" range={range} setRange={setRange} />
    )
}

export default UploadVideoCountChart