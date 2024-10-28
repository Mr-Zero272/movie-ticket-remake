import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = [
    '/sign-in',
    '/sign-up',
    '/change-pass',
    '/api/uploadthing',
    '/api/user',
    '/',
    '/detail',
    '/search',
    '/schedule',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    let isPublicRoute: boolean = false;
    for (let i = 0; i < publicRoutes.length; i++) {
        if (pathname.startsWith(publicRoutes[i])) {
            isPublicRoute = true;
            break;
        }
    }

    if (isPublicRoute) {
        return NextResponse.next();
    }

    if (!request.cookies.has('mmtk')) {
        // Redirect to login page if no token is found
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
