import { authenticate } from '@/services/authServices';
import { SignInInfo } from '@/types/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const { usernameOrEmail, password, keepLogin } = (await req.json()) as SignInInfo;

    try {
        // Call Spring Boot API for authentication
        const response = await authenticate({ usernameOrEmail, password, keepLogin });
        if (response && 'token' in response) {
            const { token, refreshToken } = response;
            if (keepLogin) {
                cookieStore.set('mmtk', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                });
            } else {
                cookieStore.set('mmtk', token, { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
            }
            return new Response(JSON.stringify({ status: 200, message: 'Authenticated successfully' }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                status: 200,
            });
        }

        if (response && 'status' in response) {
            return new Response(
                JSON.stringify({ status: response.status, message: response.message, errors: response.errors }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    status: 400,
                },
            );
        }

        return new Response(JSON.stringify({ status: 400, message: 'Undefined error' }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 400,
        });
    } catch (error) {
        console.log(error);
        throw new Error('Cannot authenticate user!');
    }
}
