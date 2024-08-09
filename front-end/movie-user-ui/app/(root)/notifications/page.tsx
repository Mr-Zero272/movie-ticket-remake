import { timeAgo } from '@/lib/utils';
import { fetchUser } from '@/services';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {};

const Page = async (props: Props) => {
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
            <div className="mb-5 flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-x-5">
                    <div className="flex flex-col items-center">
                        <div className="size-3 rounded-full bg-primary" />
                        <div className="relative mt-1 w-0.5 grow rounded-full bg-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                        <p>
                            <strong className="font-semibold">Dale Houtstan & John Deen</strong> sent you a messages.
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos voluptatum sed animi
                            repellendus accusamus. Ratione eveniet ut accusantium asperiores praesentium.
                        </p>
                        <p className="text-gray-400">{timeAgo(new Date('2024-08-04T21:00:00').toISOString())}</p>
                    </div>
                </div>
            </div>
            <div className="mb-5 flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-x-5">
                    <div className="flex flex-col items-center">
                        <div className="size-3 rounded-full bg-gray-500" />
                        <div className="relative mt-1 w-0.5 grow rounded-full bg-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                        <p>
                            <strong className="font-semibold">Dale Houtstan & John Deen</strong> sent you a messages.
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos voluptatum sed animi
                            repellendus accusamus. Ratione eveniet ut accusantium asperiores praesentium.
                        </p>
                        <p className="text-gray-400">{timeAgo(new Date('2024-08-04T21:00:00').toISOString())}</p>
                    </div>
                </div>
            </div>
            <div className="mb-5 flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-x-5">
                    <div className="flex flex-col items-center">
                        <div className="size-3 rounded-full bg-gray-500" />
                        <div className="relative mt-1 w-0.5 grow rounded-full bg-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                        <p>
                            <strong className="font-semibold">Dale Houtstan & John Deen</strong> sent you a messages.
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos voluptatum sed animi
                            repellendus accusamus. Ratione eveniet ut accusantium asperiores praesentium.
                        </p>
                        <p className="text-gray-400">{timeAgo(new Date('2024-08-04T21:00:00').toISOString())}</p>
                    </div>
                </div>
            </div>
            <div className="mb-5 flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-x-5">
                    <div className="flex flex-col items-center">
                        <div className="size-3 rounded-full bg-gray-500" />
                        <div className="relative mt-1 w-0.5 grow rounded-full bg-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                        <p>
                            <strong className="font-semibold">Dale Houtstan & John Deen</strong> sent you a messages.
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos voluptatum sed animi
                            repellendus accusamus. Ratione eveniet ut accusantium asperiores praesentium.
                        </p>
                        <p className="text-gray-400">{timeAgo(new Date('2024-08-04T21:00:00').toISOString())}</p>
                    </div>
                </div>
            </div>
            <div className="mb-5 flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-x-5">
                    <div className="flex flex-col items-center">
                        <div className="size-3 rounded-full bg-gray-500" />
                        <div className="relative mt-1 w-0.5 grow rounded-full bg-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                        <p>
                            <strong className="font-semibold">Dale Houtstan & John Deen</strong> sent you a messages.
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos voluptatum sed animi
                            repellendus accusamus. Ratione eveniet ut accusantium asperiores praesentium.
                        </p>
                        <p className="text-gray-400">{timeAgo(new Date('2024-08-04T21:00:00').toISOString())}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
