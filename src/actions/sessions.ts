"use server"

import {auth, clerkClient} from "@clerk/nextjs/server";

const client = clerkClient()

export const deleteSession = async (sessionId: string) => {
    const { userId } = auth()

    if (!userId) return "Unauthorized"

    await client.sessions.revokeSession(sessionId)
}

export const isAdmin = async () => {
    const { userId } = auth()

    if (!userId) return false

    const currentUser = await client.users.getUser(userId)
    return currentUser?.privateMetadata?.isAdmin
}