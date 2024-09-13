import React from 'react';
import { useAuth } from './AuthProvider';

type Props = {
    children: React.ReactNode;
};

const SignedIn = ({ children }: Props) => {
    const { user, loading } = useAuth();

    if (loading) return null; // Optional: render nothing while loading

    return user ? children : null;
};

export default SignedIn;
