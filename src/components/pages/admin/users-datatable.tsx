"use client"

import * as React from "react"
import {
    CaretSortIcon,
    ChevronDownIcon,
} from "@radix-ui/react-icons"
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
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getUsersWithPaginationAndQuery} from "@/actions/admin";
import {IoIosSearch} from "react-icons/io";
import UserDropdownMenu from "@/components/pages/admin/user-dropdown-menu";

export interface ITableUser {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    createdAt: number,
    banned: boolean
}

export default function UsersDataTable({ currentUserAdminLevel }: { currentUserAdminLevel: number }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        id: false
    })
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
    const [isPending, setIsPending] = useState<boolean>(false)

    const [dataUsers, setDataUsers] = React.useState<ITableUser[]>([])
    const [total, setTotal] = React.useState<number>(0)
    const [page, setPage] = React.useState<number>(1)
    const [query, setQuery] = useState<string>("")
    const perPage = 5

    const fetchUsers = React.useCallback(async (sQuery = query) => {
        try {
            const sortField = sorting[0]?.id || "email"
            const sortOrder = sorting[0]?.desc ? "desc" : "asc"

            setIsPending(true)
            const response = await getUsersWithPaginationAndQuery({
                limit: perPage,
                offset: (page - 1) * perPage,
                query: sQuery.length > 2 ? sQuery : "",
                sortField,
                sortOrder
            })

            if (typeof response === 'string') {
                return console.error(response)
            }

            const users = response[0] as ITableUser[]
            const total = response[1] as number

            setDataUsers(users)
            setTotal(total)
            setIsPending(false)
        } catch (e) {
            console.error(e)
            setIsPending(false)
        }
    }, [sorting, page, query, setDataUsers, setTotal]);

    useEffect(() => {
        fetchUsers()
    }, [page, sorting, columnFilters])

    const columns = React.useMemo<ColumnDef<ITableUser>[]>(() => [
        {
            id: "select",
            cell: ({ row }) => (
                <Checkbox
                    checked={!!rowSelection[row.original.id]}
                    onCheckedChange={(value) => {
                        setRowSelection((prev) => {
                            const newSelection = { ...prev };
                            if (value) {
                                newSelection[row.original.id] = true;
                            } else {
                                delete newSelection[row.original.id];
                            }
                            return newSelection;
                        });
                    }}
                    aria-label="Select row"
                    disabled={isPending}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "ID",
            cell: ({row}) => <div>{row.getValue("id")}</div>,
        },
        {
            accessorKey: "username",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    disabled={isPending}
                >
                    Username
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("username")}</div>,
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    disabled={isPending}
                >
                    Email
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "firstName",
            header: "First Name",
            cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
            cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    disabled={isPending}
                >
                    Created At
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"));
                return (
                    <div>{date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <UserDropdownMenu currentUserAdminLevel={currentUserAdminLevel} user={user} fetchUsers={fetchUsers} />
                );
            },
        },
    ], [isPending, rowSelection, setRowSelection, fetchUsers, currentUserAdminLevel]);

    const table = useReactTable({
        data: dataUsers,
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
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        let sQuery = event.currentTarget.query.value

        if (sQuery.length > 2) {
            setQuery(sQuery)
        } else {
            setQuery("")
        }

        setPage(1)
        fetchUsers(sQuery)
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <form onSubmit={handleSubmitSearch} className="space-x-2 flex">
                    <Input
                        placeholder="Search by data"
                        name="query"
                        className="max-w-sm"
                    />
                    <Button variant="outline" type="submit"><IoIosSearch size={23} /></Button>
                </form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                        {(!isPending || table.getRowModel().rows?.length) ? table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={row.original.banned ? "bg-red-50" : ""}
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
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Loading.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {Object.keys(rowSelection).length} of{" "}
                    {total} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1 || isPending}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page >= Math.ceil(total / perPage) || isPending}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
