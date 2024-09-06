'use client';
import React, { Fragment } from 'react';

import { navbarLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SignedIn, SignedOut, SignOutButton, useAuth } from '@clerk/nextjs';
import { Separator } from '../ui/separator';

import ThemeButton from '../ui/theme-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import { LogIn, LogOut, Moon } from 'lucide-react';

type Props = {};

function Sidebar({}: Props) {
    const pathname = usePathname();
    // const { userId } = useAuth();
    return (
        <div className="sticky left-0 top-0 h-screen w-64 p-3 shadow-md dark:shadow-none max-lg:w-20 max-md:hidden">
            <div className="flex h-16 items-center max-lg:justify-center">
                <Link href="/" className="flex cursor-pointer items-center gap-x-2 max-lg:gap-x-0">
                    <Image src="/assets/logo.svg" alt="logo" width={40} height={40} />
                    <p className="text-xl font-semibold max-lg:hidden">
                        Moon <span className="text-primary">M</span>ovie
                    </p>
                </Link>
            </div>
            <div className="flex h-[calc(100%_-_4rem)] flex-col justify-between">
                <div>
                    {navbarLinks.map((link) => {
                        const isActive =
                            (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                        // if (link.route === '/profile') link.route = `${link.route}/${userId}`;
                        return (
                            <Fragment key={link.label}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                className={cn(
                                                    'group flex items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                                    { 'bg-accent text-primary dark:text-white': isActive },
                                                )}
                                                href={link.route}
                                            >
                                                {link.icon}

                                                <p
                                                    className={cn(
                                                        'ml-3 w-full text-gray-500 transition-all duration-150 max-lg:hidden',
                                                        {
                                                            'text-primary dark:text-white': isActive,
                                                        },
                                                    )}
                                                >
                                                    {link.label}
                                                </p>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            className="z-[100] hidden dark:border-none max-lg:block"
                                        >
                                            <TooltipArrow className="fill-white dark:fill-black" />
                                            <p>{link.label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Fragment>
                        );
                    })}
                </div>

                <div>
                    <Separator orientation="horizontal" />
                    <SignedIn>
                        {/* <Link
                            className={cn(
                                'group flex items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                {
                                    'bg-accent text-gray-950 dark:text-white':
                                        pathname.includes('/notifications') || pathname === '/notifications',
                                },
                            )}
                            href={'/notifications'}
                        >
                            <Bell className="size-6" />

                            <div className="flex w-full items-center justify-between max-lg:hidden">
                                <p
                                    className={cn('ml-3 text-gray-500 transition-all duration-150', {
                                        'text-gray-950 dark:text-white':
                                            pathname.includes('/notifications') || pathname === '/notifications',
                                    })}
                                >
                                    Notifications
                                </p>
                                <Badge>12</Badge>
                            </div>
                        </Link> */}

                        <div
                            className={cn(
                                'group flex items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent max-lg:hidden',
                                {
                                    'bg-accent text-gray-950 dark:text-white':
                                        pathname.includes('/notifications') || pathname === '/notifications',
                                },
                            )}
                        >
                            <Moon className="size-6" />

                            <div className="flex w-full items-center justify-between">
                                <p
                                    className={cn('ml-3 text-gray-500 transition-all duration-150', {
                                        'text-gray-950 dark:text-white':
                                            pathname.includes('/notifications') || pathname === '/notifications',
                                    })}
                                >
                                    Dark mode
                                </p>
                                <ThemeButton isSwitch />
                            </div>
                        </div>
                        <div className="group hidden items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent max-lg:flex">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ThemeButton />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        className="z-[100] hidden dark:border-none max-lg:block"
                                    >
                                        <TooltipArrow className="fill-white dark:fill-black" />
                                        <p>Dark mode</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <SignOutButton redirectUrl="/sign-in">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                'group flex cursor-pointer items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                            )}
                                        >
                                            <LogOut className="size-6" />

                                            <p
                                                className={cn(
                                                    'ml-3 w-full text-gray-500 transition-all duration-150 max-lg:hidden',
                                                )}
                                            >
                                                Sign out
                                            </p>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        className="z-[100] hidden dark:border-none max-lg:block"
                                    >
                                        <TooltipArrow className="fill-white dark:fill-black" />
                                        <p>Sign out</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </SignOutButton>
                    </SignedIn>

                    <SignedOut>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/sign-in"
                                        className={cn(
                                            'group flex items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                        )}
                                    >
                                        <LogIn className="size-6" />

                                        <p
                                            className={cn(
                                                'ml-3 w-full text-gray-500 transition-all duration-150 max-lg:hidden',
                                            )}
                                        >
                                            Sign in
                                        </p>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="z-[100] hidden dark:border-none max-lg:block">
                                    <TooltipArrow className="fill-white dark:fill-black" />
                                    <p>Sign in</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </SignedOut>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
