import React from 'react'
import Header from "@/components/pages/admin/header";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FaFilter} from "react-icons/fa";
import {currentUser} from "@clerk/nextjs/server";
import AnalyticsTable from "@/components/pages/admin/analytics-table";
import { Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import ChartAnalytics from "@/components/pages/admin/chart";


const AnalyticsAndStatisticPage: React.FC = async () => {
    const user = await currentUser()

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: 'Analytics and Statistics', description: 'View analytics and statistics'}} />

            <main className="mt-5">
                <ChartAnalytics />

                <div className="flex space-x-3 mb-3.5">
                    <Input placeholder="Search by category" className="max-w-64" />
                    <Button variant="outline">
                        <FaFilter className="mr-1.5" />
                        Filter
                    </Button>
                </div>
                <AnalyticsTable />
            </main>
        </div>
    )
}

export default AnalyticsAndStatisticPage