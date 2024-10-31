import ShowingDetail from '@/components/shared/ShowingDetail';
import { formatCurrencyUSD } from '@/lib/utils';
import { fetchMovie } from '@/services/movieServices';
import { format } from 'date-fns';
import { LucideBarChart3, MessageCircleMore, UserRoundPen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Trailer from './trailer';
import { redirect } from 'next/navigation';
import { currentUser } from '@/services/authServices';
import RecommendMovies from '@/components/shared/RecommendMovies';
import { Metadata, ResolvingMetadata } from 'next';
import CommentSection from './comment-section';

type Props = {
    params: Promise<{ movieId: number }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    // read route params
    const movieId = (await params).movieId;

    // fetch data
    const movieInfo = await fetchMovie(movieId);

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    const poster = movieInfo.posterPath
        ? movieInfo.posterPath
        : 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg';

    return {
        title: movieInfo.title + ' - Moon Movie',
        description: 'More information about the movie',
        openGraph: {
            images: [poster, ...previousImages],
        },
    };
}

const Page = async ({ params }: Props) => {
    const userInfo = await currentUser();

    let userId = '@';

    if (userInfo !== undefined) {
        userId = userInfo.id;
        if (!userInfo?.onboarded) redirect('/onboarding');
    }

    const movieId = (await params).movieId;

    const movieInfo = await fetchMovie(movieId);
    return (
        <div>
            <Trailer
                movieId={movieInfo.id}
                userId={userId}
                userFavoriteMovies={movieInfo.userFavoriteMovies}
                title={movieInfo.title}
                video={movieInfo.video}
                genres={movieInfo.genres}
                backdropPath={movieInfo.backdropPath}
            />

            <section className="px-14">
                <article className="mb-5 flex justify-around rounded-md bg-gray-100 py-3 dark:bg-gray-900">
                    <div className="flex items-center gap-3">
                        <UserRoundPen className="size-6 dark:text-gray-500" />
                        <p className="max-md:hidden">Average vote</p>
                        <p className="rounded-sm bg-gray-600 p-1.5 text-xs text-white">
                            {movieInfo.voteAverage.toFixed(1)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LucideBarChart3 className="size-6 dark:text-gray-500" />
                        <p className="max-md:hidden">Reviews</p>
                        <p className="rounded-sm bg-gray-600 p-1.5 text-xs text-white">{123}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <MessageCircleMore className="size-6 dark:text-gray-500" />
                        <p className="max-md:hidden">Rating now</p>
                    </div>
                </article>
                <article>
                    <ShowingDetail movieId={movieId} isUserSignIn={userId !== '@'} />
                </article>
                <div className="mb-10 flex justify-between gap-x-36 max-lg:flex-col">
                    <article className="w-1/2 max-lg:mb-10 max-lg:w-full">
                        <h3 className="mb-5 text-xl">Detail</h3>
                        <div className="flex flex-col gap-y-3">
                            <div className="flex justify-between border-b border-b-gray-500 pb-1">
                                <p className="text-gray-500">Budget</p>
                                <p>{movieInfo.budget === 0 ? '?' : formatCurrencyUSD(movieInfo.budget)}</p>
                            </div>
                            <div className="flex justify-between border-b border-b-gray-500 pb-1">
                                <p className="text-gray-500">Language</p>
                                <p>{movieInfo.originalLanguage}</p>
                            </div>
                            <div className="flex justify-between border-b border-b-gray-500 pb-1">
                                <p className="text-gray-500">Runtime</p>
                                <p>{movieInfo.runtime} min</p>
                            </div>
                            <div className="flex justify-between border-b border-b-gray-500 pb-1">
                                <p className="text-gray-500">Release</p>
                                <p>{format(new Date(movieInfo.releaseDate), 'dd MMM yyyy')}</p>
                            </div>
                        </div>
                    </article>
                    <article className="w-1/2 max-lg:w-full">
                        <h3 className="mb-5 text-xl">Overview</h3>
                        <p className="text-gray-500">{movieInfo.overview}</p>
                    </article>
                </div>
                <div className="mb-10">
                    <h3 className="mb-3 text-xl">Gallery</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {movieInfo.galleries.map((gallery) => (
                            <div key={gallery.id}>
                                <Image
                                    className="h-auto w-full rounded-lg"
                                    src={gallery.imgUrl}
                                    alt={'gallery' + movieInfo.title + gallery.id}
                                    width={200}
                                    height={200}
                                    quality={100}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <RecommendMovies movieId={movieId} userId={userId} />
                <div className="mb-10">
                    <h3 className="mb-3 text-xl">Shared</h3>
                    <div className="flex gap-x-5">
                        <Link href="www.facebook.com" className="text-gray-500">
                            <svg
                                fill="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                className="h-5 w-5 hover:text-primary"
                                viewBox="0 0 24 24"
                            >
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                        </Link>
                        <Link href="www.twitter.com" className="ml-3 text-gray-500">
                            <svg
                                fill="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                className="h-5 w-5 hover:text-primary"
                                viewBox="0 0 24 24"
                            >
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                        </Link>
                        <Link href="www.instagram.com" className="ml-3 text-gray-500">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                className="h-5 w-5 hover:text-primary"
                                viewBox="0 0 24 24"
                            >
                                <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <CommentSection movieId={movieId} />
            </section>
        </div>
    );
};

export default Page;
