import React from 'react';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import '../globals.css';

export const metadata: Metadata = {
    title: 'Threads',
    description: 'A Next.js 14 Meta Threads Application',
};

const inter = Inter({ subsets: ['latin'] });

type Props = React.PropsWithChildren<{}>;

const RootLayout = ({ children }: Props) => {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <main className="flex h-svh w-svw flex-row">
                        <div className="min-h-screen w-56 bg-green-400"></div>
                        <section className="flex-1">
                            <div className="flex h-16 w-full justify-between bg-yellow-400">
                                <span>123</span>
                                <span>456</span>
                            </div>
                            <div className="mt-16">{children}</div>
                        </section>
                    </main>
                </body>
            </html>
        </ClerkProvider>
    );
};

export default RootLayout;
