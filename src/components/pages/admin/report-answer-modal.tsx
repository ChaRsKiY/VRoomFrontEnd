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

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ReportAnswerForm = ({ report }: { report: Report }) => {
    const [reportType, setReportType] = useState("");
    const [response, setResponse] = useState("");
    const [details, setDetails] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = () => {
        setIsPending(true);
        console.log({ reportType, response, details });
        alert("Response submitted successfully!");
    };

    return (
        <Dialog>
            <DialogTrigger className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-neutral-100 transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                Answer to report
            </DialogTrigger>
            <DialogContent className="max-h-screen">
                <DialogHeader>
                    <DialogTitle>Respond info</DialogTitle>
                    <DialogDescription>
                        Please fill out the form below to address the report. Ensure all information
                        is accurate before submission.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <Label className="block mb-3">
                            Report Type: {report.subject}
                        </Label>

                        <Label>Report Content</Label>
                        <Textarea
                            placeholder="Write the report type here..."
                            value={report.content}
                            className="w-full h-auto resize-none"
                        />

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Response
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
                            placeholder="Write your response here..."
                        />
                    </div>

                    <Button disabled={isPending} type="button" className="w-full" onClick={handleSubmit}>
                        Submit Response
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    )
}

export default ReportAnswerForm