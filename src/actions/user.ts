"use server"

import {auth, clerkClient} from "@clerk/nextjs/server";
import axios from "axios";
import {env} from "std-env";

const client = clerkClient();

export async function changePassword({currentPassword, newPassword, signOutOfOtherSessions}: {currentPassword: string, newPassword: string, signOutOfOtherSessions: boolean}) {
    const user = auth();

    if (user && user.userId) {
        try {
            const response = await axios.post(`https://api.clerk.com/v1/users/${user.userId}/verify_password`, {
                password: currentPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
                }
            });

            if (response.data.verified === true) {
                await client.users.updateUser(user.userId, {
                    password: newPassword,
                    signOutOfOtherSessions
                })
            }
            return { success: true, errors: [] }
        } catch (error: any) {
            if (error?.response?.status === 422 || error?.response?.status === 400)
                return { success: false, errors: [{ message: "Invalid password", longMessage: "The password you entered is incorrect" }] }
            else {
                return { success: false, errors: [{ message: error?.errors[0]?.message, longMessage: error?.errors[0]?.longMessage }] }
            }
        }
    }
}