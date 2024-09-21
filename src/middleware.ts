import {NextRequest, NextResponse} from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';
import { i18nRouter } from 'next-i18n-router';
import i18nConfig from '../i18nConfig';

export async function middleware(request: NextRequest) {
    const i18 =  i18nRouter(request, i18nConfig);
    // @ts-ignore
    const clerk = await clerkMiddleware()(request);

    return i18;
}

export const config = {
    matcher: [
        '/((?!_next|signin|signin/[^/]*|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',

        '/((?!api|static|.*\\..*|_next).*)'
    ],
};