import { NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';
import { i18nRouter } from 'next-i18n-router';
import i18nConfig from '../i18nConfig';

export async function middleware(request) {
    const clerkResponse = await clerkMiddleware()(request) as any;

    if (clerkResponse.status !== 200) {
        return clerkResponse;
    }

    const i18nResponse = i18nRouter(request, i18nConfig);

    if (i18nResponse) {
        return i18nResponse;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|signin|signin/[^/]*|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',

        '/((?!api|static|.*\\..*|_next).*)'
    ],
};