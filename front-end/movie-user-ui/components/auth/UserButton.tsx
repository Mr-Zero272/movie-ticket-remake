'use client';

import { Skeleton } from '../ui/skeleton';

import { LogOut, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from './AuthProvider';
import SignOutButton from './SignOutButton';

type Props = {};

const UserButton = (props: Props) => {
    const { loading, user } = useAuth();

    return (
        <div>
            {!loading ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Image
                            src={
                                user && user.avatar
                                    ? user.avatar
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
                        <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
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

export default UserButton;
