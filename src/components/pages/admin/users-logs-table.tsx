"use client"

import React, {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import api from "@/services/axiosApi";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {IoIosSearch} from "react-icons/io";
import {useTranslation} from "next-i18next";

interface UserLog {
    id: number;
    adminId: string;
    action: string;
    description: string;
    date: string;
}

export default function UsersLogsTable() {
    const [userLogs, setUserLogs] = useState<UserLog[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const { t } = useTranslation()

    const perPage = 6;

    useEffect(() => {
        const fetchUserLogs = async () => {
            try {
                const response = await api.get(`/AdminLog?page=${page}&perPage=${perPage}&type=user&searchQuery=${searchQuery}`);
                setUserLogs(response.data.adminLogs as UserLog[]);
                setTotalCount(response.data.adminLogsCount as number);
            } catch (e) {
                console.error(e);
            }
        }

        fetchUserLogs();
    }, [page, searchQuery]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = (e.currentTarget.querySelector("input") as HTMLInputElement).value;
        if (query === searchQuery) return;
        setSearchQuery(query);
    }

    return (
        <>
            <form className="flex my-5 space-x-2" onSubmit={handleSearch}>
                <Input placeholder={t("search")} className="w-[200px]" />
                <Button variant="outline" type="submit"><IoIosSearch size={23} /></Button>
            </form>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">{t("admin-main:log-id")}</TableHead>
                        <TableHead>{t("admin-main:user-id")}</TableHead>
                        <TableHead>{t("admin-main:action")}</TableHead>
                        <TableHead>{t("admin-main:description")}</TableHead>
                        <TableHead className="text-right">{t("admin-main:timestamp")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userLogs.length !== 0 && userLogs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.id}</TableCell>
                            <TableCell className="font-medium">{log.adminId}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.description}</TableCell>
                            <TableCell className="text-right">{new Date(log.date).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>{t("admin-main:previous")}</Button>
                <Button variant="outline" onClick={() => setPage(page + 1)} disabled={totalCount <= page * perPage}>{t("admin-main:next")}</Button>
            </div>
        </>

    );
}
