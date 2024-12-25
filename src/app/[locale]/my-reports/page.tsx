import React from 'react'
import api from "@/services/axiosApi";
import {currentUser} from "@clerk/nextjs/server";
import NotFound from "@/app/[locale]/not-found";
import initTranslations from "@/app/i18n";
import HeaderHome from "@/components/pages/home/header/header";
import {FaUser} from "react-icons/fa";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

interface ContentReport {
    id: number;
    title: string;
    adminAnswer: string;
    description: string;
    type: string;
    status: string;
    createdAt: string;
    closedAt: string;
    subjectId: number;
}

interface Props {
    params: {
        locale: string;
    }
}

const parseIconByType = (type: string) => {
    switch (type) {
        case 'user':
            return <FaUser size={23}/>;
        case 'content':
            return '📄';
        case 'comment':
            return '💬';
        default:
            return '❓';
    }
}

const MyReportsPage = async ({ params: { locale } }: Props) => {
    const { t } = await initTranslations(locale, ['common', 'categories','tagname']);

    const user = await currentUser()

    if (!user) {
        return <NotFound />;
    }

    const res = await api.get(`/ContentReport/${user.id}/my-reports`);
    const data = res.data as ContentReport[];

    return (
        <div className="w-full">
            <div className="flex pt-20 overflow-hidden">
                {t && <HeaderHome t={t}/>}
            </div>

            <main className="w-full">
                {data.map((report) => (
                    <div key={report.id} className="rounded-[0.5rem] m-5 p-3 border">
                        <div className="flex pb-4 justify-between">
                            <div className="flex space-x-3 items-center">
                                {parseIconByType(report.type)}
                                <h3 className="font-bold">{report.title}</h3>
                            </div>
                            <div className="text-blue italic">{report.status}</div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <Label>Description</Label>
                                <Input value={report.description} disabled/>
                            </div>

                            <div>
                                <Label>Created at</Label>
                                <Input value={new Date(report.createdAt).toLocaleString()} disabled/>
                            </div>

                            <div>
                                <Label>Closed at</Label>
                                <Input value={new Date(report.closedAt).toLocaleString()} disabled/>
                            </div>
                        </div>

                        {(report.status === 'Closed' && report.adminAnswer) && (
                            <div className="mt-4">
                                <Label>Admin Answer</Label>
                                <div className="bg-neutral-50 p-2 pl-3 rounded-[0.5rem] max-w-[350px]">
                                    <div dangerouslySetInnerHTML={{__html: report.adminAnswer}}/>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
    )
}

export default MyReportsPage