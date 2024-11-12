import MarqueeText from '@/components/ui/marquee-text';
import { currentUser } from '@/services/authServices';
import { fetchListFavoriteMovies } from '@/services/favoriteServices';
import { fetchPopularMovies } from '@/services/movieServices';
import { getTickets } from '@/services/reservationServices';
import { Movie } from '@/types/movie';
import { BadgeHelp, CalendarCheck, Heart, Monitor } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import ListTicket from './list-ticket';
import { Fragment } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Your tickets - Moon Movie',
    description: 'Your tickets',
};

const Tickets = async () => {
    const userInfo = await currentUser();

    if (userInfo === undefined) {
        redirect('/sign-in');
    }

    if (!userInfo?.onboarded) redirect('/onboarding');

    const listTickets = await getTickets({ filter: 'all', page: 1, size: 100 });

    const favoriteMovies = await fetchListFavoriteMovies(userInfo.id);
    let popularMovies: Movie[] = [];
    if (listTickets.length === 0) {
        popularMovies = (await fetchPopularMovies({ page: 1, size: 20, sort: 'releaseDate', genreId: 0 })).data;
    }

    const orderCount = new Set(listTickets.map((t) => t.orderId)).size;

    return (
        <Fragment>
            <div className="flex gap-3 rounded-lg bg-black p-4 dark:bg-white md:max-h-[35rem]">
                <ListTicket userId={userInfo.id} listTickets={listTickets} listPopularMovies={popularMovies} />
                <div className="max-h-[35rem] w-1/6 max-[1490px]:w-1/3 max-md:hidden">
                    <div className="flex flex-col items-center gap-y-5">
                        <Image
                            src={userInfo.avatar ?? ''}
                            alt="avatar"
                            width={400}
                            height={400}
                            quality={100}
                            className="size-20 rounded-full object-cover"
                        />
                        <div className="text-white dark:text-black">
                            <p>Hello,</p>
                            <p className="text-2xl font-bold">{userInfo.username}</p>
                        </div>
                    </div>
                    <div className="mt-5 space-y-2 rounded-lg bg-white p-4 dark:bg-[#121212]">
                        <div className="flex items-center gap-x-3">
                            <Monitor className="size-8 rounded-lg bg-green-200 p-1.5 text-green-800" />
                            <div className="text-sm">
                                <MarqueeText text="Total tickets" className="font-bold" />

                                <p className="text-gray-500">{listTickets.length} tickets</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <CalendarCheck className="size-8 rounded-lg bg-blue-200 p-1.5 text-blue-800" />
                            <div className="text-sm">
                                <MarqueeText text="Total orders" className="font-bold" />
                                <p className="text-gray-500">{orderCount} orders</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <Heart className="size-8 rounded-lg bg-yellow-200 p-1.5 text-yellow-800" />
                            <div className="text-sm">
                                <MarqueeText text="Favorite movies" className="font-bold" />
                                <p className="text-gray-500">{favoriteMovies.length} movies</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-col items-center space-y-2 rounded-lg bg-white p-4 dark:bg-[#121212]">
                        <BadgeHelp className="size-10 text-gray-500" />
                        <p className="text-center font-bold">Some thing wrong with the tickets!</p>
                        <button className="w-full rounded-full bg-primary py-1.5 text-white dark:bg-white dark:text-black">
                            Contact now!
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Tickets;
