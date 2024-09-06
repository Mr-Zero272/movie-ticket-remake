'use client';

import React, { Fragment } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import { navbarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

type Props = {};

function Footerbar({}: Props) {
    const pathname = usePathname();
    // const { userId } = useAuth();
    return (
        <section className="xs:px-7 fixed bottom-0 z-10 w-full rounded-t-3xl border bg-white p-4 dark:border-none dark:bg-[#121417] md:hidden">
            <div className="xs:gap-5 flex items-center justify-between gap-3">
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
                                                'group flex flex-col items-center justify-between rounded-lg p-2 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                                { 'bg-accent text-primary dark:text-white': isActive },
                                            )}
                                            href={link.route}
                                        >
                                            {link.icon}
                                            <p
                                                className={cn(
                                                    'ml-3 w-full text-gray-500 transition-all duration-150 max-sm:hidden',
                                                    {
                                                        'text-primary dark:text-white': isActive,
                                                    },
                                                )}
                                            >
                                                {link.label}
                                            </p>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="hidden dark:border-none max-sm:block">
                                        <TooltipArrow className="fill-white dark:fill-black" />
                                        <p>{link.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Fragment>
                    );
                })}
            </div>
        </section>
    );
}

export default Footerbar;
