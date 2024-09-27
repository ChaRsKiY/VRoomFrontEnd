"use server"

import {auth, clerkClient} from "@clerk/nextjs/server";

const client = clerkClient();

export const deleteEmailAddress = async (id: string) => {
    const { userId } = auth();
    if (!userId) {
        return { success: false, error: "Unauthorized", longError: "User is not authenticated" };
    }

    try {
        await client.emailAddresses.deleteEmailAddress(id);

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.errors[0].message,
            longError: error.errors[0].longMessage
        };
    }
}

export const setPrimaryEmailAddress = async (id: string) => {
    const { userId } = auth();
    if (!userId) {
        return { success: false, error: "Unauthorized", longError: "User is not authenticated" };
    }

    try {
        await client.emailAddresses.updateEmailAddress(id, { primary: true });

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.errors[0].message,
            longError: error.errors[0].longMessage
        };
    }
}