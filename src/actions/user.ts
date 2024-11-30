
"use server"

import {auth, clerkClient} from "@clerk/nextjs/server";

const client = clerkClient()

export const getUserById = async (userId: string) => {

}