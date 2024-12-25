import { clerkMiddleware } from '@clerk/nextjs/server';
import { i18nRouter } from 'next-i18n-router';
import i18nConfig from '../i18nConfig';

export default clerkMiddleware((auth, req) => {
    return i18nRouter(req, i18nConfig);
})

export const config = {
    matcher: [
        '/((?!_next|signin|signin/[^/]*|signup|signup/[^/]*|account|account/[^/]*|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(trpc)(.*)',
        '/((?!api|static|.*\\..*|_next).*)'
    ],
};