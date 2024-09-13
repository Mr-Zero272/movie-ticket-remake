import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = ['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing', '/api/user(.*)'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname.startsWith('/api/user')) {
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
