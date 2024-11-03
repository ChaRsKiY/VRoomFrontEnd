"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useEffect, useState} from "react";
import {getUsersWithPagination} from "@/actions/admin";
import {IoIosMore} from "react-icons/io";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";

interface ITableUser {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    createdAt: number
}

interface ISelectedUser {
    id: string,
    page: number
}

const UsersTable = () => {
    const [users, setUsers] = useState<ITableUser[]>([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(1)

    const [selectedUsers, setSelectedUsers] = useState<ISelectedUser[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsersWithPagination({limit: 5, offset: (page - 1) * 5})

                if (typeof users === 'string') {
                    return console.error(users)
                }

                setUsers(users[0] as ITableUser[])
                setTotal(users[1] as number)
            } catch (e) {
                console.error(e)
            }
        }

        fetchUsers()
    }, [page])

    const handleSelectUser = (id: string) => {
        const index = selectedUsers.findIndex(user => user.id === id)
        if (index === -1) {
            setSelectedUsers([...selectedUsers, {id, page: 0}])
        } else {
            setSelectedUsers(selectedUsers.filter(user => user.id !== id))
        }
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead className="w-[300px]">Id</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="w-[50px]"><Checkbox
                                checked={selectedUsers.findIndex(el => el.id === user.id) >= 0}
                                onClick={() => handleSelectUser(user.id)}/></TableCell>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell className="flex justify-end items-center"><IoIosMore size={22}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell className="text-right">{total}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            <div className="space-x-2 flex justify-center mb-10 mt-2">
                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
                <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page * 5 >= total}>Next</Button>
            </div>

            <div className="mt-5 p-3 border rounded-[0.5rem] flex space-x-3 items-center">
                <div className="h-9 flex items-center">Selected {selectedUsers.length}</div>
                {selectedUsers.length > 0 && (
                    <>
                        <div className="flex pl-6">
                            <Button className="px-0 mr-10" variant="link" onClick={() => setSelectedUsers([])}>Unselect
                                all</Button>
                            <Button className="px-0" variant="link">Ban all</Button>
                            <Button variant="link">Unban all</Button>
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
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="w-[50px]"><Checkbox
                                checked={selectedUsers.findIndex(el => el.id === user.id) >= 0}
                                onClick={() => handleSelectUser(user.id)}/></TableCell>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell className="flex justify-end items-center"><IoIosMore size={22}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell className="text-right">{total}</TableCell>
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
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="w-[50px]"><Checkbox
                                checked={selectedUsers.findIndex(el => el.id === user.id) >= 0}
                                onClick={() => handleSelectUser(user.id)}/></TableCell>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell className="flex justify-end items-center"><IoIosMore size={22}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell className="text-right">{total}</TableCell>
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

export default UsersTable
