"use client"

import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {IoIosMore} from "react-icons/io";
import {Button} from "@/components/ui/button";
import {useState} from "react";

interface IContentReport {
    id: string,
    sender_id: string,
    content: string,
    status: string,
    subject: string,
}

const contentReports: IContentReport[] = [
    {
        id: '1',
        sender_id: '1',
        content: 'This is a content report',
        status: 'Pending',
        subject: 'Report'
    },
    {
        id: '2',
        sender_id: '2',
        content: 'This is a content report',
        status: 'Pending',
        subject: 'Report'
    },
    {
        id: '3',
        sender_id: '3',
        content: 'This is a content report',
        status: 'Pending',
        subject: 'Report'
    },
    {
        id: '4',
        sender_id: '4',
        content: 'This is a content report',
        status: 'Pending',
        subject: 'Report'
    },
    {
        id: '5',
        sender_id: '5',
        content: 'This is a content report',
        status: 'Pending',
        subject: 'Report'
    },
]

interface ISelectedContentReport {
    id: string,
    page: number
}

const ContentReportsTable = () => {
    const [page, setPage] = useState<number>(1)
    const [selectedContentReports, setSelectedContentReports] = useState<ISelectedContentReport[]>([])

    const handleSelectContentReport = (id: string) => {
        const index = selectedContentReports.findIndex(cr => cr.id === id)
        if (index === -1) {
            setSelectedContentReports([...selectedContentReports, {id, page: 0}])
        } else {
            setSelectedContentReports(selectedContentReports.filter(cr => cr.id !== id))
        }
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead className="w-[300px]">Id</TableHead>
                        <TableHead>Sender Id</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contentReports.map((cr) => (
                        <TableRow key={cr.id}>
                            <TableCell className="w-[50px]"><Checkbox
                                checked={selectedContentReports.findIndex(el => el.id === cr.id) >= 0}
                                onClick={() => handleSelectContentReport(cr.id)}/></TableCell>
                            <TableCell className="font-medium">{cr.id}</TableCell>
                            <TableCell>{cr.sender_id}</TableCell>
                            <TableCell>{cr.content}</TableCell>
                            <TableCell>{cr.status}</TableCell>
                            <TableCell>{cr.subject}</TableCell>
                            <TableCell className="flex justify-end items-center"><IoIosMore size={22}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6}>Total</TableCell>
                        <TableCell className="text-right">{contentReports.length}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            <div className="space-x-2 flex justify-center mb-10 mt-2">
                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
                <Button variant="outline" onClick={() => setPage(page + 1)}
                        disabled={page * 5 >= contentReports.length}>Next</Button>
            </div>

            <div className="mt-5 p-3 border rounded-[0.5rem] flex space-x-3 items-center">
                <div className="h-9 flex items-center">Selected {selectedContentReports.length}</div>
                {selectedContentReports.length > 0 && (
                    <>
                        <div className="flex pl-6">
                            <Button className="px-0 mr-10" variant="link" onClick={() => setSelectedContentReports([])}>Unselect
                                all</Button>
                            <Button className="px-0" variant="link">Close all</Button>
                        </div>
                    </>
                )}
            </div>

            <div className="h-[1px] bg-neutral-300 rounded mt-10 mb-6"/>

            <h2 className="mb-2 text-xl">Logs</h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead className="w-[300px]">Id</TableHead>
                        <TableHead>Sender Id</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contentReports.map((cr) => (
                        <TableRow key={cr.id}>
                            <TableCell className="w-[50px]"><Checkbox
                                checked={selectedContentReports.findIndex(el => el.id === cr.id) >= 0}
                                onClick={() => handleSelectContentReport(cr.id)}/></TableCell>
                            <TableCell className="font-medium">{cr.id}</TableCell>
                            <TableCell>{cr.sender_id}</TableCell>
                            <TableCell>{cr.content}</TableCell>
                            <TableCell>{cr.status}</TableCell>
                            <TableCell>{cr.subject}</TableCell>
                            <TableCell className="flex justify-end items-center"><IoIosMore size={22}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6}>Total</TableCell>
                        <TableCell className="text-right">{contentReports.length}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            <div className="h-[1px] bg-neutral-300 rounded mt-10 mb-6"/>

            <h2 className="mb-2 text-xl">Analytics</h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead className="w-[300px]">Id</TableHead>
                        <TableHead>Sender Id</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contentReports.map((cr) => (
                        <TableRow key={cr.id}>
                            <TableCell className="w-[50px]"><Checkbox
                                checked={selectedContentReports.findIndex(el => el.id === cr.id) >= 0}
                                onClick={() => handleSelectContentReport(cr.id)}/></TableCell>
                            <TableCell className="font-medium">{cr.id}</TableCell>
                            <TableCell>{cr.sender_id}</TableCell>
                            <TableCell>{cr.content}</TableCell>
                            <TableCell>{cr.status}</TableCell>
                            <TableCell>{cr.subject}</TableCell>
                            <TableCell className="flex justify-end items-center"><IoIosMore size={22}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6}>Total</TableCell>
                        <TableCell className="text-right">{contentReports.length}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            <div className="h-[1px] bg-neutral-300 rounded mt-10 mb-8"/>

            <div className="space-x-2">
                <Button>Export</Button>
                <Button>Import</Button>
            </div>
        </div>
    )
}

export default ContentReportsTable