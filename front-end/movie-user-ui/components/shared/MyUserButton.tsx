'use client';
import { SignOutButton, useUser } from '@clerk/nextjs';
import React from 'react';
import { Skeleton } from '../ui/skeleton';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

const MyUserButton = (props: Props) => {
    const { isLoaded, user } = useUser();

    return (
        <div>
            {isLoaded ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Image
                            src={
                                user
                                    ? user.imageUrl
                                    : 'https://i.pinimg.com/originals/f0/ab/cc/f0abcce41dcc6b804105e710d6def988.jpg'
                            }
                            alt="avatar"
                            width={30}
                            height={30}
                            quality={100}
                            className="size-7 scale-100 cursor-pointer rounded-full transition-all duration-200 ease-linear active:scale-105"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 dark:border-none">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href="/profile">
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                            <SignOutButton redirectUrl="/sign-in">
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </SignOutButton>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Skeleton className="size-7 rounded-full" />
            )}
        </div>
    );
};

export default MyUserButton;
