import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

import Header from '@/components/shared/Header';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from '@/components/shared/Sidebar';
import Footerbar from '@/components/shared/Footerbar';
import Footer from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Moon Movie (Make your night bright)',
    description: 'NextJs Moon Movie application',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                        <main className="flex">
                            <Sidebar />
                            <section className="mb-16 w-[calc(100%_-_16rem)] flex-1 max-lg:w-[calc(100%_-_5rem)] max-md:w-full md:mb-0">
                                <Header />
                                <div className="min-h-[35rem] w-full">{children}</div>
                                <Footer />
                            </section>
                        </main>
                        <Footerbar />
                        <Toaster />
                    </ThemeProvider>
                </body>
            </html>
        </AuthProvider>
    );
}
