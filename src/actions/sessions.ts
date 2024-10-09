"use server"



import {auth, clerkClient} from "@clerk/nextjs/server";

const client = clerkClient()

export const deleteSession = async (sessionId: string) => {
    const { userId } = auth()

    if (!userId) return "Unauthorized"

    await client.sessions.revokeSession(sessionId)
}