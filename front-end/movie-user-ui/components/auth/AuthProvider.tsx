'use client';
import { User } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

type AuthContextType = {
    user: User | undefined;
    loading: boolean;
    signOut: (redirectUrl: string) => void;
    updateUser: (user: User) => void;
    isUserSignedIn: () => boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: undefined,
    loading: false,
    signOut: () => {},
    updateUser: () => {},
    isUserSignedIn: () => {
        return false;
    },
});

const AuthProvider = ({ children }: Props) => {
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const callApi = async () => {
            const res = await fetch(`/api/user`, {
                method: 'GET',
                credentials: 'include',
            });

            const result = (await res.json()) as User;

            setUser(result);
        };

        callApi();

        setLoading(false);
    }, []);

    const updateUser = (user: User) => {
        setUser(user);
    };

    const isUserSignedIn = () => {
        return user !== undefined;
    };

    const signOut = async (redirectUrl: string) => {
        await fetch(`/api/user/auth/sign-out`, {
            method: 'POST',
            credentials: 'include',
        });

        router.replace(redirectUrl);
    };

    return (
        <AuthContext.Provider value={{ user, signOut, loading, updateUser, isUserSignedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
