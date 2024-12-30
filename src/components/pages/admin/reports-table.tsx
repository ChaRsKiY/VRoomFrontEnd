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
import api from "@/services/axiosApi";
import {IoIosSearch} from "react-icons/io";
import {useUser} from "@clerk/nextjs";
import {useTranslation} from "next-i18next";

export type Report = {
    id: string
    senderUserId: number
    status: "Open" | "Closed" | "Processing"
    title: string
    description: string
    type: string
    createdAt: string
    adminId: string
    adminAnswer: string
}

const fetchReports = async (page: number, perPage: number, searchQuery: string = "") => {
    try {
        const res = await api.get("/ContentReport?page=" + page + "&perPage=" + perPage + "&searchQuery=" + searchQuery);
        return { data: res.data.contentReports, total: res.data.count }
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
    const [searchQuery, setSearchQuery] = useState("")
    const { user } = useUser()

    const { t } = useTranslation()

    const perPage = 5;

    const columns: ColumnDef<Report>[] = [
        {
            accessorKey: "id",
            header: t("admin-main:id"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "senderUserId",
            header: t("admin-main:sender-id"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("senderUserId")}</div>
            ),
        },
        {
            accessorKey: "status",
            header: t("admin-main:status"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("status")}</div>
            ),
        },
        {
            accessorKey: "title",
            header: t("admin-main:title"),
            cell: ({ row }) => <div className="capitalize">{row.getValue("title") ? row.getValue("title") : "-"}</div>,
        },
        {
            accessorKey: "type",
            header: t("admin-main:type"),
            cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: t("admin-main:created-at"),
            cell: ({ row }) => <div className="lowercase">{new Date(row.getValue("createdAt")).toLocaleString()}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const report = row.original

                const handleProcess = async () => {
                    try {
                        if (!user) return;
                        await api.put("/ContentReport/" + report.id + "/" + user.id + "/process", {});
                        await fetchReports(page, perPage, searchQuery);
                    } catch (e) {
                        console.error(e)
                    }
                }

                const handleReOpen = async (e: React.MouseEvent) => {
                    try {
                        await api.put("/ContentReport/" + report.id + "/reopen", {});
                        await fetchReports(page, perPage, searchQuery);
                    } catch (e) {
                        console.error(e)
                    }
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("admin-main:open-menu")}</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("admin-main:actions")}</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(report.id)}
                            >
                                {t("admin-main:copy-report-id")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(report.senderUserId.toString())}
                            >
                                {t("admin-main:copy-sender-id")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {report.status === "Open" && <DropdownMenuItem onClick={handleProcess}>{t("admin-main:process")}</DropdownMenuItem>}
                            {report.status === "Processing" && report.adminId === user?.id && <DropdownMenuItem asChild><ReportAnswerForm report={report} /></DropdownMenuItem>}
                            {report.status === "Closed" && <DropdownMenuItem onClick={handleReOpen}>{t("admin-main:reopen")}</DropdownMenuItem>}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    useEffect(() => {
        (async () => {
            setIsPending(true)
            const { data, total } = await fetchReports(page, perPage, searchQuery);
            setData(data)
            setTotal(total)
            setIsPending(false)
        })()
    }, [page, sorting, searchQuery])

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

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const query = (e.currentTarget.querySelector("input") as HTMLInputElement).value
        if (query === searchQuery) return
        setSearchQuery(query)
    }

    return (
        <div className="w-full">
            <div className="flex items-center">
                <form className="flex my-5 space-x-2" onSubmit={handleSearch}>
                    <Input placeholder={t("admin-main:search")} className="w-[200px]"/>
                    <Button variant="outline" type="submit"><IoIosSearch size={23}/></Button>
                </form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button disabled={isPending} variant="outline" className="ml-auto">
                            {t("admin-main:columns")} <ChevronDown/>
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
                                        {column.columnDef?.header?.toString()}
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
                                    {t("admin-main:no-results")}
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
                        {t("admin-main:previous")}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= Math.ceil(total / perPage) || isPending}
                    >
                        {t("admin-main:next")}
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