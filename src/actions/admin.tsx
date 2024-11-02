"use server"

import {auth, clerkClient} from "@clerk/nextjs/server";

const client = clerkClient()

export const getUsersWithPagination = async ({ limit, offset }: { limit: number, offset: number }) => {
    const { userId } = auth()

    if (!userId) {
        return 'User not found in session'
    }

    const currentUser = await client.users.getUser(userId)
    if (!currentUser?.privateMetadata?.isAdmin) {
        return 'You are not authorized to perform this action'
    }

    const { data, totalCount } = await client.users.getUserList({ limit, offset })

    return [data.map(user => ({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        createdAt: user.createdAt
    })), totalCount]
}