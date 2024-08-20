import { timeAgo } from '@/lib/utils';
import { fetchUser } from '@/services/userServices';
import { currentUser } from '@clerk/nextjs/server';
import { MonitorCog } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {};

const Notifications = async (props: Props) => {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    console.log(userInfo);

    if (!userInfo?.onboarded) redirect('/onboarding');
    return (
        <div className="p-4">
            <div className="mb-5">
                <h2 className="text-3xl font-bold">Notifications</h2>
                <p className="text-gray-400">You have 12 notifications unread!</p>
            </div>
            <Link href="/order/detail/1" className="mb-5 flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-x-5">
                    <div className="flex flex-col items-center">
                        <Image
                            src="assets/logo.svg"
                            alt="friend"
                            width={50}
                            height={50}
                            quality={100}
                            className="size-10 rounded-full object-cover"
                        />
                        <div className="relative mt-1 w-0.5 grow rounded-full bg-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                        <p>
                            <strong className="font-semibold">System</strong>{' '}
                        </p>
                        <p className="text-gray-500">
                            You have just completed an order and your ticket information has been sent to your email.
                            You can check it. Thank you for ordering at Moon Movie.
                        </p>
                        <p className="text-gray-400">{timeAgo(new Date('2024-08-09T21:00:00').toISOString())}</p>
                    </div>
                </div>
            </Link>
            <Link href="/order/detail/2" className="mb-5 flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-x-5">
                    <div className="flex flex-col items-center">
                        <Image
                            src="https://i.pinimg.com/originals/e3/ac/88/e3ac88de46e2dcca24e780a3b2c8d4dc.jpg"
                            alt="friend"
                            width={50}
                            height={50}
                            quality={100}
                            className="size-10 rounded-full object-cover"
                        />
                        <div className="relative mt-1 w-0.5 grow rounded-full bg-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                        <p>
                            <strong className="font-semibold">Kayako</strong>
                        </p>
                        <p className="text-gray-500">
                            Just sent your a message. Happy to your career! Have a nice day my friend.
                        </p>
                        <p className="text-gray-400">{timeAgo(new Date('2024-08-10T14:00:00').toISOString())}</p>
                    </div>
                </div>
            </Link>
            <Link href="/order/detail/3" className="mb-5 flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-x-5">
                    <div className="flex flex-col items-center">
                        <Image
                            src="https://i.pinimg.com/originals/25/d3/dc/25d3dcd96956ff923c43a7218b2ad51b.webp"
                            alt="friend"
                            width={50}
                            height={50}
                            quality={100}
                            className="size-10 rounded-full object-cover"
                        />
                        <div className="relative mt-1 w-0.5 grow rounded-full bg-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                        <p>
                            <strong className="font-semibold">Noelle</strong>
                        </p>
                        <p className="text-gray-500">
                            Just sent you a message. I just finished my work for the week. Would you like to join me for
                            a drink?
                        </p>
                        <p className="text-gray-400">{timeAgo(new Date('2024-08-10T14:00:00').toISOString())}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Notifications;
