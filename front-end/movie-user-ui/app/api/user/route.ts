import { getUserInfo } from '@/services/authServices';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');

    if (token) {
        let userInfo = await getUserInfo(token.value);
        return new Response(JSON.stringify(userInfo), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        redirect('/sign-in');
    }
}
