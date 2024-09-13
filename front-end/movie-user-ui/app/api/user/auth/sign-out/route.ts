import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = cookies();
    cookieStore.delete('mmtk');
    cookieStore.delete('mmrtk');

    return new Response(JSON.stringify({ status: 200, message: 'Logout successfully!' }));
}

export async function GET() {
    return new Response(JSON.stringify({ status: 200, message: 'Logout successfully!' }));
}
