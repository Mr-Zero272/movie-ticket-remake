import MovieCardItemVertical from '@/components/cards/MovieCardItemVertical';
import MovieCarousel from '@/components/shared/MovieCarousel';
import ScrollList from '@/components/shared/ScrollList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchUser } from '@/services';
import { currentUser } from '@clerk/nextjs/server';
import { FileVideo, Headset, Ticket, Users } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function Home() {
    const user = await currentUser();

    if (!user) return null;

    console.log(user.id);

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');
    return (
        <div className="p-4">
            <MovieCarousel />
            <ScrollList title="Opening this week">
                <div className="mb-5 grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2">
                    <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                        <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                            CHOOSE DATE
                        </label>
                        <Select>
                            <SelectTrigger
                                className="no-focus border-none bg-transparent outline-none"
                                id="choose-date"
                            >
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="border-none outline-none">
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                        <label htmlFor="choose-cinema-type" className="mb-3 text-xs text-gray-400">
                            CHOOSE CINEMA TYPE
                        </label>
                        <Select>
                            <SelectTrigger
                                className="no-focus border-none bg-transparent outline-none"
                                id="choose-cinema-type"
                            >
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="border-none outline-none">
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2">
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                </div>
            </ScrollList>
            <ScrollList title="Coming soon">
                <div className="grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2">
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                    <MovieCardItemVertical />
                </div>
            </ScrollList>
            <section className="body-font text-gray-600">
                <div className="container mx-auto px-5 py-24">
                    <div className="mb-20 flex w-full flex-col text-center">
                        <h1 className="title-font mb-4 text-2xl font-medium text-gray-900 dark:text-gray-200 sm:text-3xl">
                            MoonMovie where your night is bright.
                        </h1>
                        <p className="mx-auto text-base leading-relaxed lg:w-2/3">
                            MoonMovie provides a fast and convenient movie ticket booking service. Providing a fast,
                            modern and beautiful movie ticket buying experience. Now buying movie tickets with us will
                            be easier than ever.
                        </p>
                    </div>
                    <div className="-m-4 flex flex-wrap text-center">
                        <div className="w-full p-4 sm:w-1/2 md:w-1/4">
                            <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                                <FileVideo className="mb-3 inline-block h-12 w-12 text-primary" />
                                <h2 className="title-font text-3xl font-medium text-gray-900 dark:text-gray-200">
                                    2.7K
                                </h2>
                                <p className="leading-relaxed">Movies</p>
                            </div>
                        </div>
                        <div className="w-full p-4 sm:w-1/2 md:w-1/4">
                            <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                                <Users className="mb-3 inline-block h-12 w-12 text-primary" />
                                <h2 className="title-font text-3xl font-medium text-gray-900 dark:text-gray-200">
                                    1.3K
                                </h2>
                                <p className="leading-relaxed">Users</p>
                            </div>
                        </div>
                        <div className="w-full p-4 sm:w-1/2 md:w-1/4">
                            <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                                <Ticket className="mb-3 inline-block h-12 w-12 text-primary" />
                                <h2 className="title-font text-3xl font-medium text-gray-900 dark:text-gray-200">
                                    722
                                </h2>
                                <p className="leading-relaxed">Tickets Sold</p>
                            </div>
                        </div>
                        <div className="w-full p-4 sm:w-1/2 md:w-1/4">
                            <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                                <Headset className="mb-3 inline-block h-12 w-12 text-primary" />
                                <h2 className="title-font text-3xl font-medium text-gray-900 dark:text-gray-200">
                                    24/7
                                </h2>
                                <p className="leading-relaxed">Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
