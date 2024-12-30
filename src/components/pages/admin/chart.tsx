 "use client"

import { TrendingUp } from "lucide-react"
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Line,
    LineChart,
    Pie,
    PieChart,
    XAxis,
    YAxis
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import React, {useState} from "react";
import ChartSelectDropdown from "@/components/pages/admin/chart-select-dropdown";
import {CurveType} from "recharts/types/shape/Curve";
import RangeSelectDropdown from "@/components/pages/admin/range-select-dropdown";
import ColorSelectDropdown from "@/components/pages/admin/color-select-dropdown";
import DifferenceDateSelectDropdown from "@/components/pages/admin/difference-date-select-dropdown";
import {RangeDate} from "@/components/pages/admin/registration-summary-chart";
 import {useTranslation} from "next-i18next";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    }
} satisfies ChartConfig

export interface AnalyticData {
    month: string;
    count: number;
}

export const dateToMonth = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear();
}

export const dateToWeek = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString("default", { weekday: "long" }) + " " + d.toLocaleString("default", { month: "long" }) + " " + d.getDate();
}

export interface ChartType {
    type: "bar" | "line" | "area" | "pie";
    value: string;
}

interface Props {
    chartTitle: string;
    chartDescription: string;
    data: AnalyticData[];
    range: string;
    setRange: (range: string) => void;
    dataKey: string;
    rangeDate: RangeDate | null;
    setRangeDate: (rangeDate: RangeDate) => void;
}

export default function ChartAnalytics({ chartTitle, chartDescription, data, range, setRange, dataKey, rangeDate, setRangeDate }: Props) {
    const [color, setColor] = useState("auto");
    const [chartType, setChartType] = useState<ChartType>({ type: "area", value: "bump" });

    const { t } = useTranslation();

    const analyzeData = (data: AnalyticData[]) => {
        if (!data || data.length === 0) {
            return {
                trendText: t("admin-main:no-data"),
                rangeText: "",
            };
        }

        const counts = data.map((item) => item.count);
        const total = counts.reduce((sum, count) => sum + count, 0);
        const average = (total / counts.length).toFixed(1);

        const firstCount = counts[0];
        const lastCount = counts[counts.length - 1];
        const trend = lastCount - firstCount;
        const trendPercentage = ((trend / (firstCount || 1)) * 100).toFixed(1); // Защита от деления на ноль

        const maxCount = Math.max(...counts);
        const minCount = Math.min(...counts);

        let trendText;
        if (trend > 0) {
            trendText = `${t("admin-main:trending-up-by")} ${trendPercentage}%`;
        } else if (trend < 0) {
            trendText = `${t("admin-main:trending-down-by")} ${Math.abs(parseFloat(trendPercentage))}%`;
        } else {
            trendText = t("admin-main:no-trend");
        }

        const rangeText = `${t("admin-main:total")} ${total}, ${t("admin-main:avg")} ${average}, ${t("admin-main:max")} ${maxCount}, ${t("admin-main:min")} ${minCount}`;

        return {
            trendText,
            rangeText,
        };
    };

    return (
        <Card className="h-full min-w-[340px]">
            <CardHeader>
                <div className="flex justify-between">
                    <div className="space-y-1.5">
                        <CardTitle>{chartTitle}</CardTitle>
                        <CardDescription>
                            {chartDescription}
                        </CardDescription>
                    </div>
                    <div className="flex justify-end flex-wrap gap-1">
                        <ColorSelectDropdown color={color} setColor={setColor} />
                        <RangeSelectDropdown rangeDate={rangeDate} currentRange={range} setCurrentRange={setRange} />
                        <ChartSelectDropdown currentChart={chartType} setCurrentChart={setChartType} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {renderChart(data, chartType, color)}
            </CardContent>
            <CardFooter>
                <div className="flex w-full justify-between items-center gap-2 text-sm">
                    <div className="grid gap-2">
                        {data.length > 0 ? (
                            (() => {
                                const {trendText, rangeText} = analyzeData(data);
                                return (
                                    <>
                                        <div className="flex items-center gap-2 font-medium leading-none">
                                            {trendText} <TrendingUp className="h-4 w-4"/>
                                        </div>
                                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                            {range === "year"
                                                ? t("admin-main:jan-dec") :
                                                (range === "month") ? t("admin-main:last-30-days") : t("admin-main:last-7-days")}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {rangeText}
                                        </div>
                                    </>
                                );
                            })()
                        ) : (
                            <div className="text-muted-foreground">{t("admin-main:no-data")}</div>
                        )}
                    </div>
                    <div>
                        <DifferenceDateSelectDropdown date={rangeDate} setDate={setRangeDate} />
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

const renderChart = (data: AnalyticData[], chartType: ChartType, color: string) => {
    if (data.length === 0) {
        return <div>-</div>;
    }

    if (chartType.type === "area") {
        return (
            <ChartContainer config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        top: 5,
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                        dataKey="count"
                        type={chartType.value as CurveType}
                        fill={color === "auto" ? "var(--color-desktop)" : color}
                        fillOpacity={0.4}
                        stroke={color === "auto" ? "var(--color-desktop)" : color}
                    />
                </AreaChart>
            </ChartContainer>
        );
    } else if (chartType.type === "bar") {
        return (
            <ChartContainer config={chartConfig}>
                <BarChart
                    margin={chartType.value === "label" ? {top: 25,} : {}}
                    accessibilityLayer
                    data={data}
                    layout={chartType.value !== "horizontal" ? "horizontal" : "vertical"}
                >
                    <CartesianGrid vertical={false}/>
                    {chartType.value === "horizontal" ? (
                        <>
                            <XAxis type="number" dataKey="count" hide/>
                            <YAxis
                                dataKey="month"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                        </>
                    ) : (
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                    )}
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar dataKey="count" fill={color === "auto" ? "green" : color} radius={2}>
                        {chartType.value === "label" && <LabelList
                            position="top"
                            offset={8}
                            className="fill-foreground"
                            fontSize={16}
                        />}
                    </Bar>
                </BarChart>
            </ChartContainer>
        )
    } else if (chartType.type === "line") {
        return (
            <ChartContainer config={chartConfig}>
                <LineChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        top: 5,
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <Line
                        dataKey="count"
                        type={chartType.value as CurveType}
                        stroke={color === "auto" ? "blue" : color}
                        strokeWidth={2}
                        dot={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                </LineChart>
            </ChartContainer>
        )
    } else if (chartType.type === "pie") {
        return (
            <ChartContainer config={chartConfig}>
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" className="w-[150px]" />}
                    />
                    <Pie data={applyColorsToData(data, color)} label={chartType.value === "label"} dataKey="count" nameKey="month" innerRadius={chartType.value === "donut" ? 50 : 0} />
                </PieChart>
            </ChartContainer>
        )
    }
}

const generateColor = (baseColor: any, index: number, total: number) => {
    if (baseColor === "auto") {
        // Автоматическая генерация пастельных цветов
        const pastelHues = [0, 220, 120, 40]; // Красный, Синий, Зеленый, Оранжевый (в градусах HSL)
        const hue = pastelHues[index % pastelHues.length];
        const lightness = 70 + (index % 2) * 10; // 70% или 80% яркости для разнообразия
        return `hsl(${hue}, 70%, ${lightness}%)`;
    } else {
        // Генерация оттенков на основе заданного цвета ("rgb(r, g, b)")
        const [r, g, b] = baseColor
            .match(/\d+/g)
            .map(Number);

        // Конвертируем RGB в HSL
        const rgbToHsl = (r: number, g: number, b: number) => {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h: any, s: number, l = (max + min) / 2;

            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            return [h * 360, s, l];
        };

        const [h, s, l] = rgbToHsl(r, g, b);

        // Генерируем оттенок, сохраняя тон и насыщенность, но изменяя яркость
        const shadeFactor = 0.9 + (index / total) * 0.6; // От 80% до 100% яркости
        return `hsl(${h}, ${s * 100}%, ${l * 100 * shadeFactor}%)`;
    }
};

const applyColorsToData = (data: AnalyticData[], color = "auto") => {
    return data.map((item, index) => ({
        ...item,
        fill: generateColor(color, index, data.length),
    }));
};
