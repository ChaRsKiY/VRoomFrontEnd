"use client"

import React, {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Report} from "@/components/pages/admin/reports-table";
import {Label} from "@/components/ui/label";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import api from "@/services/axiosApi";
import {toast} from "@/hooks/use-toast";
import {useTranslation} from "next-i18next";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ReportAnswerForm = ({ report }: { report: Report }) => {
    const [response, setResponse] = useState(report.adminAnswer);
    const [isPending, setIsPending] = useState(false);
    const [open, setOpen] = useState(false);

    const { t } = useTranslation()

    const handleSubmit = async () => {
        if (!response) {
            return;
        }

        setIsPending(true);

        try {
            await api.post(`/ContentReport/${report.id}/answer`, { answer: response });
            toast({
                title: t("admin-main:report-answered"),
                description: t("admin-main:report-answered-description"),
            });
            setOpen(false);
            setIsPending(false);
        } catch (e) {
            console.error(e);
            setIsPending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-neutral-100 transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                {t("admin-main:answer-report")}
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-scroll">
                <DialogHeader>
                    <DialogTitle>{t("admin-main:respond-info")}</DialogTitle>
                    <DialogDescription>
                        {t("admin-main:respond-info-description")}
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <Label className="block mb-3">
                            {t("admin-main:report-type")} {report.type}
                        </Label>

                        <Label>{t("admin-main:report-content")}</Label>
                        <Textarea
                            placeholder={t("admin-main:report-content-placeholder")}
                            value={report.description}
                            className="w-full h-auto resize-none"
                        />

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("admin-main:response")}
                        </label>
                        <ReactQuill
                            value={response}
                            onChange={setResponse}
                            className="bg-white"
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, 3, false] }],
                                    ["bold", "italic", "underline", "strike"],
                                    [{ color: [] }, { background: [] }],
                                    ["blockquote", "code-block"],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    ["link", "image"],
                                    ["clean"],
                                ],
                            }}
                            placeholder={t("admin-main:response-placeholder")}
                        />
                    </div>

                    <Button disabled={isPending} type="button" className="w-full" onClick={handleSubmit}>
                        {t("admin-main:submit-response")}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    )
}

export default ReportAnswerForm