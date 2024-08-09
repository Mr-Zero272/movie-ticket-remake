import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

// If you use `request` you don't need the type
export async function POST(req: NextRequest) {
    // Get the user ID from the session
    const { userId } = getAuth(req);

    // Get body
    const body = req.body;

    if (!userId) return NextResponse.redirect('/sign-in');

    // The user attributes to update
    const params = { firstName: 'John', lastName: 'Wick' };

    const updatedUser = await clerkClient.users.updateUser(userId, params);

    return NextResponse.json({ updatedUser });
}
