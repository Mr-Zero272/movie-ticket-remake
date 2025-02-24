import React, { Suspense } from 'react';
import { Metadata } from 'next';

import { Inter } from 'next/font/google';

import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AuthProvider from '@/components/auth/AuthProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: 'Moon Movie (Make your night bright)',
    description: 'NextJs Moon Movie application',
};

const inter = Inter({ subsets: ['latin'] });

type Props = React.PropsWithChildren<{}>;

const RootLayout = ({ children }: Props) => {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-dark-1`}>
                <AuthProvider>
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                        <Suspense>
                            <div className="flex min-h-screen w-full items-center justify-center">{children}</div>
                        </Suspense>
                    </ThemeProvider>
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    );
};

export default RootLayout;
