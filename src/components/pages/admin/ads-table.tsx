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
import {useSession, useUser} from "@clerk/nextjs";
import Image from "next/image";

export type Ad = {
    id: string
    title: string
    description: string
    url: string
    imageUrl: string
    createdAt: string
}

const fetchAds = async (page: number, perPage: number, searchQuery: string = "") => {
    try {
        const res = await api.get("/Ad?page=" + page + "&perPage=" + perPage + "&searchQuery=" + searchQuery);
        return { data: res.data.ads, total: res.data.count }
    } catch (e) {
        console.error(e)
        return { data: [], total: 0 }
    }
}

export default function AdsTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
            id: false,
            senderId: false,
        })
    const [data, setData] = React.useState<Ad[]>([])
    const [page, setPage] = React.useState(1)
    const [total, setTotal] = React.useState(0)
    const [isPending, setIsPending] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const { user } = useUser()

    const perPage = 5;

    const columns: ColumnDef<Ad>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("title")}</div>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("description")}</div>
            ),
        },
        {
            accessorKey: "url",
            header: "URL",
            cell: ({ row }) => (
                <div>{row.getValue("url")}</div>
            ),
        },
        {
            accessorKey: "imageUrl",
            header: "Image URL",
            cell: ({ row }) => (
                <Image src={row.getValue("imageUrl")} alt={row.getValue("title")} width={55} height={55} />
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => (
                <div className="capitalize">{new Date(row.getValue("createdAt")).toLocaleString()}</div>
            ),
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
                                Copy ad ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    useEffect(() => {
        (async () => {
            setIsPending(true)
            const { data, total } = await fetchAds(page, perPage, searchQuery);
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
                    <Input placeholder="Search..." className="w-[200px]"/>
                    <Button variant="outline" type="submit"><IoIosSearch size={23}/></Button>
                </form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button disabled={isPending} variant="outline" className="ml-auto">
                            Columns <ChevronDown/>
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