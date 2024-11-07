"use server"

import {auth, clerkClient} from "@clerk/nextjs/server";

const client = clerkClient()

const parseSortFieldOrder = (sortField: string, sortOrder: string) => {
    if (sortField === 'email') {
        return sortOrder === 'asc' ? '+email_address' : '-email_address'
    }

    if (sortField === 'username') {
        return sortOrder === 'asc' ? '+username' : '-username'
    }

    if (sortField === 'createdAt') {
        return sortOrder === 'asc' ? '+created_at' : '-created_at'
    }

    return undefined
}

export const getUsersWithPaginationAndQuery = async ({limit, offset, query, sortField, sortOrder}: { limit: number, offset: number, query: string, sortField: string, sortOrder: string }) => {
    const {userId} = auth()

    if (!userId) {
        return 'User not found in session'
    }

    const currentUser = await client.users.getUser(userId)
    if (!currentUser?.privateMetadata?.isAdmin) {
        return 'You are not authorized to perform this action'
    }

    if ((currentUser.privateMetadata.adminLevel as number) < 2) return 'unauthorized';

    try {
        const {data, totalCount} = await client.users.getUserList({limit, offset, query, orderBy: parseSortFieldOrder(sortField, sortOrder)})

        return [data.map(user => ({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            username: user.username || '',
            createdAt: user.createdAt,
            banned: user.banned
        })), totalCount]
    } catch (error: any) {
        console.error('Error getting users:', error)
        return error.errors[0].longMessage
    }
}

export const getUsersWithPagination = async ({ limit, offset }: { limit: number, offset: number }) => {
    const { userId } = auth()

    if (!userId) {
        return 'User not found in session'
    }

    const currentUser = await client.users.getUser(userId)
    if (!currentUser?.privateMetadata?.isAdmin) {
        return 'You are not authorized to perform this action'
    }

    if ((currentUser.privateMetadata.adminLevel as number) < 2) return 'unauthorized';

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

export const getUserById = async (userId: string) => {
    const { userId: currentUserId } = auth()

    if (!currentUserId) {
        return 'unauthorized'
    }

    const currentUser = await client.users.getUser(currentUserId)
    if (!currentUser?.privateMetadata?.isAdmin) {
        return 'unauthorized'
    }

    if ((currentUser.privateMetadata.adminLevel as number) < 2) return 'unauthorized';

    const user = await client.users.getUser(userId)

    return JSON.stringify(user)
}

export const deleteUser = async (userId: string) => {
    const { userId: currentUserId } = auth()

    if (userId === currentUserId) return 'not_allowed';

    if (!currentUserId) {
        return 'unauthorized'
    }

    const currentUser = await client.users.getUser(currentUserId)
    if (!currentUser?.privateMetadata?.isAdmin) {
        return 'unauthorized'
    }

    if (currentUser.privateMetadata.adminLevel !== 3) return 'unauthorized';

    await client.users.deleteUser(userId)

    return 'success'
}

export const banUser = async (userId: string) => {
    const { userId: currentUserId } = auth()

    if (userId === currentUserId) return 'not_allowed';

    if (!currentUserId) {
        return 'unauthorized'
    }

    const currentUser = await client.users.getUser(currentUserId)
    if (!currentUser?.privateMetadata?.isAdmin) {
        return 'unauthorized'
    }

    if (currentUser.privateMetadata.adminLevel !== 3) return 'unauthorized';

    await client.users.banUser(userId)

    return 'success'
}

export const unbanUser = async (userId: string) => {
    const { userId: currentUserId } = auth()

    if (userId === currentUserId) return 'not_allowed';

    if (!currentUserId) {
        return 'unauthorized'
    }

    const currentUser = await client.users.getUser(currentUserId)
    if (!currentUser?.privateMetadata?.isAdmin) {
        return 'unauthorized'
    }

    if (currentUser.privateMetadata.adminLevel !== 3) return 'unauthorized';

    await client.users.unbanUser(userId)

    return 'success'
}

export const changeAdminLevelMetadata = async (userId: string, level: number): Promise<string> => {
    const { userId: currentUserId } = auth();
    if (!currentUserId) return 'unauthorized';

    if (userId === currentUserId) return 'not_allowed';

    const currentUser = await client.users.getUser(currentUserId);
    if (!currentUser?.privateMetadata?.isAdmin) return 'unauthorized';

    if (level < 0 || level > 3) return 'invalid level';

    const currentAdminLevel = currentUser.privateMetadata.adminLevel as number;
    if (currentAdminLevel <= level && currentAdminLevel !== 3) return 'not_allowed';

    const user = await client.users.getUser(userId);
    if (!user) return 'user_not_found';

    if (currentAdminLevel <= (user.privateMetadata?.adminLevel as number | 0) && currentAdminLevel !== 3) return 'not_allowed';

    try {
        await client.users.updateUserMetadata(userId, {
            privateMetadata: { isAdmin: level >= 1, adminLevel: level }
        });
    } catch (error) {
        console.error('Error updating user admin level:', error);
        return 'update_failed';
    }

    return 'success';
};

export const getAdminLevel = async (userId: string): Promise<number> => {
    const { userId: currentUserId } = auth();
    if (!currentUserId) return 0;

    const currentUser = await client.users.getUser(currentUserId);
    if (!currentUser?.privateMetadata?.isAdmin) return 0;

    const user = await client.users.getUser(userId);
    if (!user?.privateMetadata?.isAdmin) return 0;

    return user.privateMetadata.adminLevel as number;
}

export const updateUserBaseData = async (userId: string, formData: FormData) => {
    const { userId: currentUserId } = auth()

    if (!currentUserId) {
        return 'unauthorized'
    }

    const currentUser = await client.users.getUser(currentUserId)
    if (!currentUser?.privateMetadata?.isAdmin) {
        return 'unauthorized'
    }

    if ((currentUser.privateMetadata.adminLevel as number) !== 3) return 'unauthorized';

    const user = await client.users.getUser(userId)

    if (!user) return 'user_not_found'

    const userData = formData.get('userData') as any
    const file = formData.get('avatar') as File

    try {
        await client.users.updateUser(userId, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
        })

        if (!file) return 'success'

        await client.users.updateUserProfileImage(userId, { file })

        return 'success'
    } catch (e) {
        console.error('Error updating user data:', e)
        return 'update_failed'
    }

}