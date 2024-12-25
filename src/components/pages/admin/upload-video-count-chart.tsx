"use client"

import React, {useEffect, useState} from 'react'
import ChartAnalytics, {AnalyticData, dateToMonth, dateToWeek} from "@/components/pages/admin/chart";
import api from "@/services/axiosApi";
import {RangeDate} from "@/components/pages/admin/registration-summary-chart";

const UploadVideoCountChart: React.FC = () => {
    const [data, setData] = useState<AnalyticData[]>([]);
    const [rangeDate, setRangeDate] = useState<RangeDate>({
        start: null,
        end: null
    });
    const [range, setRange] = useState("year");

    const fetchData = async () => {
        try {
            const response = await api.get("/AnalyticVRoom/getuploadvideoscount/" + range);
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
            const response = await api.get("/AnalyticVRoom/getuploadvideoscountbydays/" + rangeDate?.start?.toISOString() + "/" + rangeDate?.end?.toISOString());
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
        <ChartAnalytics rangeDate={rangeDate} setRangeDate={setRangeDate} chartTitle="Video Uploads" chartDescription="A summary of the video uploads" data={data} dataKey="count" range={range} setRange={setRange} />
    )
}

export default UploadVideoCountChart