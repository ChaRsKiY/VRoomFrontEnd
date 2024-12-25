import React from 'react'
import Header from "@/components/pages/admin/header";
import {currentUser} from "@clerk/nextjs/server";
import RegistrationSummaryChart from "@/components/pages/admin/registration-summary-chart";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import UploadVideoCountChart from "@/components/pages/admin/upload-video-count-chart";
import DurationAllViewChart from "@/components/pages/admin/duration-all-view-chart";
import ChannelRequiredBlocks from "@/components/pages/admin/channel-required-blocks";

export const revalidate = 1200;

const AnalyticsAndStatisticPage: React.FC = async () => {
    const user = await currentUser();

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: 'Analytics and Statistics', description: 'View analytics and statistics'}} />

            <main className="mt-5">
                <div className="max-[1220px]:hidden">
                    <ResizablePanelGroup
                        direction="horizontal"
                        className="md:min-w-[450px] space-x-3"
                    >
                        <ResizablePanel defaultSize={50} minSize={40}>
                            <RegistrationSummaryChart />
                        </ResizablePanel>
                        <ResizableHandle className="bg-neutral-100" />
                        <ResizablePanel defaultSize={50} minSize={40}>
                            <UploadVideoCountChart />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>

                <div className="hidden space-x-3 max-[1220px]:flex max-lg:flex-col max-lg:space-x-0 max-lg:space-y-3">
                    <div className="flex-1">
                        <RegistrationSummaryChart/>
                    </div>
                    <div className="flex-1">
                        <UploadVideoCountChart/>
                    </div>
                </div>

                <div className="mt-3">
                    <DurationAllViewChart />
                </div>

                <div className="my-6 bg-neutral-200 rounded-xl h-[1.5px]" />

                <ChannelRequiredBlocks />
            </main>
        </div>
    )
}

export default AnalyticsAndStatisticPage