// components/SignedOut.js

import { useAuth } from './AuthProvider';

type Props = {
    children: React.ReactNode;
};

export default function SignedOut({ children }: Props) {
    const { user, loading } = useAuth();

    if (loading) return null; // Optional: render nothing while loading

    return !user ? children : null;
}
