import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Example log data: This should ideally come from a backend or state
const userLogs = [
    {
        id: "LOG001",
        user: "John Doe",
        changeType: "Updated Email",
        oldValue: "john.doe@example.com",
        newValue: "johnny.d@example.com",
        timestamp: "2024-11-19 10:15 AM",
    },
    {
        id: "LOG002",
        user: "Jane Smith",
        changeType: "Updated Role",
        oldValue: "Viewer",
        newValue: "Editor",
        timestamp: "2024-11-19 11:00 AM",
    },
    {
        id: "LOG003",
        user: "Alice Johnson",
        changeType: "Deactivated Account",
        oldValue: "Active",
        newValue: "Inactive",
        timestamp: "2024-11-18 03:45 PM",
    },
    {
        id: "LOG004",
        user: "Mark Brown",
        changeType: "Updated Name",
        oldValue: "Markus Brown",
        newValue: "Mark Brown",
        timestamp: "2024-11-18 04:30 PM",
    },
];

export default function UsersLogsTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Log ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Change Type</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userLogs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.id}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.changeType}</TableCell>
                        <TableCell className="text-right">{log.timestamp}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
