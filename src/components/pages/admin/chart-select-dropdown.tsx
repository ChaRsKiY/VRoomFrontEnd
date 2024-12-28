import React from 'react'
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {FaChartPie} from "react-icons/fa";
import {ChartConfig, ChartContainer} from "@/components/ui/chart";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Line,
    LineChart, Pie,
    PieChart,
    XAxis,
    YAxis
} from "recharts";
import {CurveType} from "recharts/types/shape/Curve";
import {ChartType} from "@/components/pages/admin/chart";
import {useTranslation} from "next-i18next";

interface Props {
    currentChart: ChartType;
    setCurrentChart: (chart: ChartType) => void;
}

const areaCharts = [
    {
        label: "bump",
        value: "bump",
    },
    {
        label: "linear",
        value: "linear",
    },
    {
        label: "monotone",
        value: "monotone",
    },
    {
        label: "natural",
        value: "natural",
    },
    {
        label: "step",
        value: "step",
    },
] as { label: string; value: CurveType }[];

const barCharts = [
    {
        label: "vertical",
        value: "vertical",
    },
    {
        label: "horizontal",
        value: "horizontal",
    },
    {
        label: "label",
        value: "label",
    },
]

const lineCharts = [
    {
        label: "basis",
        value: "basis",
    },
    {
        label: "linear",
        value: "linear",
    },
    {
        label: "monotone",
        value: "monotone",
    },
    {
        label: "natural",
        value: "natural",
    },
    {
        label: "step",
        value: "step",
    },
] as { label: string; value: CurveType }[];

const pieCharts = [
    {
        label: "pie",
        value: "pie",
    },
    {
        label: "donut",
        value: "donut",
    },
    {
        label: "label",
        value: "label",
    }
]

const chartConfig = {
    desktop: {
        label: "Example",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

const chartConfigPie = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartDataPie = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const ChartSelectDropdown = ({ currentChart, setCurrentChart }: Props) => {
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><FaChartPie size="18" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[350px] h-[300px] mr-5 overflow-scroll no-scrollbar p-2.5">
                <div>
                    <h2 className="text-center pt-1.5 pb-2 text-neutral-700 font-bold">{t("admin-main:area-charts")}</h2>
                    <div className='grid grid-cols-2 gap-2'>
                        {areaCharts.map((chart, key) => (
                            <div
                                key={key}
                                onClick={() => setCurrentChart({value: chart.value as string, type: "area"})}
                                className={`cursor-pointer w-full text-left border rounded-[0.5rem] p-2 ${(currentChart.value === chart.value && currentChart.type === "area") ? "bg-gray-100 dark:bg-neutral-800" : ""}`}
                            >
                                <ChartContainer config={chartConfig}>
                                    <AreaChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false}/>
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <Area
                                            dataKey="desktop"
                                            type={chart.value}
                                            fill="var(--color-desktop)"
                                            fillOpacity={0.4}
                                            stroke="var(--color-desktop)"
                                        />
                                    </AreaChart>
                                </ChartContainer>
                                <div className="text-center pt-1.5 text-neutral-600">{t("admin-main:" + chart.label)}</div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-center pt-4 pb-2 text-neutral-700 font-bold">{t("admin-main:bar-charts")}</h2>
                    <div className='grid grid-cols-2 gap-2'>
                        {barCharts.map((chart, key) => (
                            <div
                                key={key}
                                onClick={() => setCurrentChart({value: chart.value, type: "bar"})}
                                className={`cursor-pointer w-full text-left border rounded-[0.5rem] p-2 ${(currentChart.value === chart.value && currentChart.type === "bar") ? "bg-gray-100 dark:bg-neutral-800" : ""}`}
                            >
                                <ChartContainer config={chartConfig}>
                                    <BarChart
                                        margin={chart.value === "label" ? {top: 10,} : {}}
                                        accessibilityLayer
                                        data={chartData}
                                        layout={chart.value !== "horizontal" ? "horizontal" : "vertical"}
                                    >
                                        <CartesianGrid vertical={false}/>
                                        {chart.value === "horizontal" ? (
                                            <>
                                                <XAxis type="number" dataKey="desktop" hide/>
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
                                        <Bar dataKey="desktop" fill="green" radius={2}>
                                            {chart.value === "label" && <LabelList
                                                position="top"
                                                offset={8}
                                                className="fill-foreground"
                                                fontSize={8}
                                            />}
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                                <div className="text-center pt-1.5 text-neutral-600">{t("admin-main:" + chart.label)}</div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-center pt-4 pb-2 text-neutral-700 font-bold">{t("admin-main:line-charts")}</h2>
                    <div className='grid grid-cols-2 gap-2'>
                        {lineCharts.map((chart, key) => (
                            <div
                                key={key}
                                onClick={() => setCurrentChart({value: chart.value as string, type: "line"})}
                                className={`cursor-pointer w-full text-left border rounded-[0.5rem] p-2 ${(currentChart.value === chart.value && currentChart.type === "line") ? "bg-gray-100 dark:bg-neutral-800" : ""}`}
                            >
                                <ChartContainer config={chartConfig}>
                                    <LineChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false}/>
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <Line
                                            dataKey="desktop"
                                            type={chart.value}
                                            stroke="blue"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ChartContainer>
                                <div className="text-center pt-1.5 text-neutral-600">{t("admin-main:" + chart.label)}</div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-center pt-4 pb-2 text-neutral-700 font-bold">{t("admin-main:pie-charts")}</h2>
                    <div className='grid grid-cols-2 gap-2'>
                        {pieCharts.map((chart, key) => (
                            <div
                                key={key}
                                onClick={() => setCurrentChart({value: chart.value as string, type: "pie"})}
                                className={`cursor-pointer w-full text-left border rounded-[0.5rem] p-2 ${(currentChart.value === chart.value && currentChart.type === "pie") ? "bg-gray-100 dark:bg-neutral-800" : ""}`}
                            >
                                <ChartContainer config={chartConfigPie} className="mx-auto aspect-square">
                                    <PieChart>
                                        <Pie data={chartDataPie} label={chart.value === "label" ? { fontSize: 9 } : false} dataKey="visitors" nameKey="browser" innerRadius={chart.value === "donut" ? 30 : 0} />
                                    </PieChart>
                                </ChartContainer>
                                <div className="text-center pt-1.5 text-neutral-600">{t("admin-main:" + chart.label)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ChartSelectDropdown