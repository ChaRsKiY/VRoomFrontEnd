"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from "axios";
import {useEffect, useState} from "react";
import ReportAnswerForm from "@/components/pages/admin/report-answer-modal";

export type Report = {
    id: string
    senderId: string
    content?: string
    subject: string
    status: "new" | "processing" | "closed"
}

export const columns: ColumnDef<Report>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "senderId",
        header: "Sender ID",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("senderId")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    {
        accessorKey: "content",
        header: "Content",
        cell: ({ row }) => <div className="lowercase">{row.getValue("content") ? row.getValue("content") : "-"}</div>,
    },
    {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => <div className="lowercase">{row.getValue("subject")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const report = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(report.id)}
                        >
                            Copy report ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(report.senderId)}
                        >
                            Copy sender ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {report.status === "new" && <DropdownMenuItem>Process</DropdownMenuItem>}
                        {report.status === "processing" && <DropdownMenuItem asChild><ReportAnswerForm report={report} /></DropdownMenuItem>}
                        {report.status === "processing" && <DropdownMenuItem>Close</DropdownMenuItem>}
                        {report.status === "closed" && <DropdownMenuItem>Reopen</DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

const fetchReports = async (page: number, perPage: number, sorting: any[], searchQuery: string = "") => {
    const data: Report[] = [
        {
            id: "1",
            senderId: "1",
            content: "This is a report",
            subject: "Report subject",
            status: "new",
        },
        {
            id: "2",
            senderId: "2",
            content: "This is a report",
            subject: "Report subject",
            status: "processing",
        },
        {
            id: "3",
            senderId: "3",
            content: "This is a report",
            subject: "Report subject",
            status: "closed",
        },
        {
            id: "4",
            senderId: "4",
            content: "This is a report",
            subject: "Report subject",
            status: "closed",
        },
        {
            id: "5",
            senderId: "5",
            content: "This is a report",
            subject: "Report subject",
            status: "new",
        },
    ]

    try {
        //const res = await axios.get("http://localhost:3000/ru/api/reports?page=" + page + "&perPage=" + perPage + "&sorting=" + sorting + "&searchQuery=" + searchQuery)
        return { data: data, total: 13 }
    } catch (e) {
        console.error(e)
        return { data: [], total: 0 }
    }
}

export default function ReportsTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
            id: false,
            senderId: false,
        })
    const [data, setData] = React.useState<Report[]>([])
    const [page, setPage] = React.useState(1)
    const [total, setTotal] = React.useState(0)
    const [isPending, setIsPending] = useState(false)

    const perPage = 5;

    useEffect(() => {
        (async () => {
            setIsPending(true)
            const { data, total } = await fetchReports(page, perPage, sorting);
            setData(data)
            setTotal(total)
            setIsPending(false)
        })()
    }, [page, sorting])

    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(total / perPage),
        manualPagination: true,
        manualSorting: true,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter reports..."
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button disabled={isPending} variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1 || isPending}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= Math.ceil(total / perPage) || isPending}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

/*<TableHead>Sender Id</TableHead>
<TableHead>Content</TableHead>
<TableHead>Status</TableHead>
<TableHead>Subject</TableHead>
<TableHead className="text-right">Action</TableHead>*/