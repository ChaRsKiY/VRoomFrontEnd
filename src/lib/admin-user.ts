import {banUser, unbanUser} from "@/actions/admin";

export const toggleBanUser = async (userId: string, action: "ban" | "unban", setBanStatePending: (isPending: boolean) => void, fetchUser: () => Promise<void>) => {
    setBanStatePending(true);
    const response = action === "ban" ? await banUser(userId) : await unbanUser(userId);

    if (response !== "unauthorized") await fetchUser();
    setBanStatePending(false);
};