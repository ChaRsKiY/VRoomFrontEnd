import { Notification } from "@/types/notification";

export const testNotifications = [
    {
        id: 1,
        title: "New Notification",
        description: "You have a new notification",
        isRead: false,
        path: "/channel.json/3"
    },
    {
        id: 2,
        title: "New Notification",
        isRead: true,
        description: "You have a new notification",
        path: "/channel.json/3"
    },
    {
        id: 3,
        title: "New Notification",
        description: "You have a new notification",
        isRead: false,
        path: "/channel.json/3"
    },
] as Notification[]