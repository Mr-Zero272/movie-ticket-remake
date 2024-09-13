'use client';
import React from 'react';
import { useAuth } from './AuthProvider';

type Props = {
    children: React.ReactNode;
    redirectUrl: string;
};

const SignOutButton = ({ children, redirectUrl }: Props) => {
    const { signOut } = useAuth();
    return <div onClick={() => signOut(redirectUrl)}>{children}</div>;
};

export default SignOutButton;
