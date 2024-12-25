export interface DataUser {
    id: string
    username: string
    firstName: string
    lastName: string
    imageUrl: string
    emailAddresses: { emailAddress: string, id: string, verification: { status: string, strategy: string, attempts: number } }[]
    phoneNumbers: { phoneNumber: string, id: string }[]
    externalAccounts: { verification: { strategy: string }, emailAddress: string, id: string }[]
    privateMetadata: { isAdmin: boolean, adminLevel: number },
    primaryEmailAddressId: string,
    primaryPhoneNumberId: string,
    banned: boolean,
    lastActiveAt: number | null,
    createdAt: number,
    twoFactorEnabled: boolean,
    backupCodeEnabled: boolean,
    updatedAt: number,
    lastSignInAt: number,
    hasImage: boolean,
}