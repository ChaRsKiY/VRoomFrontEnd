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
import {useEffect, useState} from "react";
import api from "@/services/axiosApi";
import {IoIosSearch} from "react-icons/io";
import {useUser} from "@clerk/nextjs";
import {useTranslation} from "next-i18next";

export type Video = {
    id: string
    tittle: string
    description: string
    duration: string
    videoUrl: string
    viewCount: string
    isShort: string
    uploadDate: Date
}

const fetchVideos = async (page: number, perPage: number, searchQuery: string = "") => {
    try {
        const res = await api.get("/AdminVideos?page=" + page + "&perPage=" + perPage + "&searchQuery=" + searchQuery);
        return { data: res.data.videos, total: res.data.count }
    } catch (e) {
        console.error(e)
        return { data: [], total: 0 }
    }
}

export default function VideoManagementTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
            id: false,
            senderId: false,
        })
    const [data, setData] = React.useState<Video[]>([])
    const [page, setPage] = React.useState(1)
    const [total, setTotal] = React.useState(0)
    const [isPending, setIsPending] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const { user } = useUser()

    const { t } = useTranslation()

    const perPage = 5;

    const columns: ColumnDef<Video>[] = [
        {
            accessorKey: "id",
            header: t("admin-main:id"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "tittle",
            header: t("admin-main:title"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("tittle")}</div>
            ),
        },
        {
            accessorKey: "description",
            header: t("admin-main:description"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("description")}</div>
            ),
        },
        {
            accessorKey: "duration",
            header: t("admin-main:duration"),
            cell: ({ row }) => <div className="capitalize">{row.getValue("duration")}</div>,
        },
        {
            accessorKey: "videoUrl",
            header: t("admin-main:video-url"),
            cell: ({ row }) => <div className="lowercase">{new Date(row.getValue("videoUrl")).toLocaleString()}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const video = row.original

                const handleDelete = async () => {
                    try {
                        await api.delete("/AdminVideos/" + video.id)
                    } catch (e) {
                        alert(t("admin-main:delete-error"))
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
                            <DropdownMenuItem>{t("admin-main:go-to")}</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete}>{t("admin-main:delete")}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    useEffect(() => {
        (async () => {
            setIsPending(true)
            const { data, total } = await fetchVideos(page, perPage, searchQuery);
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
                                const title = column.columnDef.header
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {title?.toString()}
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