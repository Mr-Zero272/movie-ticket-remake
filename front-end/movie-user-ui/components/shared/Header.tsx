'use client';

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import Search from './Search';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import Image from 'next/image';
import ThemeButton from '../ui/theme-button';
import HiddenSearch from './HiddenSearch';

type Props = {};

function Header({}: Props) {
    const { isLoaded } = useUser();

    return (
        <section className="sticky top-0 z-[100] w-full">
            <div className="flex h-16 items-center justify-between bg-white px-4 shadow-md dark:bg-[#121417]">
                <Link href="/" className="hidden cursor-pointer max-md:block">
                    <Image src="/assets/logo.svg" alt="logo" width={40} height={40} />
                </Link>
                <div>
                    <Search className="max-[500px]:hidden" />
                </div>
                <div className="flex items-center gap-x-4">
                    <div className="hidden max-[500px]:block">
                        <HiddenSearch />
                    </div>
                    <div className="hidden max-md:inline-block">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ThemeButton className="rounded-lg p-2 text-gray-500 hover:bg-accent" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <TooltipArrow className="fill-white" />
                                    <p>Dark mode</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-x-6">
                        <SignedIn>{isLoaded ? <UserButton /> : <Skeleton className="size-7 rounded-full" />}</SignedIn>
                        <div className="hidden max-md:block">
                            <SignedOut>
                                <Link href="/sign-in">
                                    <Button variant="link">Sign in</Button>
                                </Link>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Header;
