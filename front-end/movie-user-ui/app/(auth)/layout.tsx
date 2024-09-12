import React from 'react';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import CookiesProviderCus from '@/components/cookie-provider';

export const metadata: Metadata = {
    title: 'Moon Movie (Make your night bright)',
    description: 'NextJs Moon Movie application',
};

const inter = Inter({ subsets: ['latin'] });

type Props = React.PropsWithChildren<{}>;

const RootLayout = ({ children }: Props) => {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                        <CookiesProviderCus>
                            <div className="flex min-h-screen w-full items-center justify-center">{children}</div>
                        </CookiesProviderCus>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
};

export default RootLayout;
