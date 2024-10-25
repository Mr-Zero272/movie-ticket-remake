import { fetchListFavoriteMovies } from '@/services/favoriteServices';
import { fetchPopularMovies } from '@/services/movieServices';
import { redirect } from 'next/navigation';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import FavoriteMain from './favorite-main';
import { currentUser } from '@/services/authServices';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Favorite movies - Moon Movie',
    description: 'Your favorite movies',
};

const FavoritePage = async () => {
    const userInfo = await currentUser();

    if (userInfo === undefined) {
        throw new Error('Error form user server!');
    }

    if (!userInfo?.onboarded) redirect('/onboarding');

    const popularMovies = await fetchPopularMovies({ page: 3, size: 4, sort: 'releaseDate', genreId: 0 });
    const favoriteMovies = await fetchListFavoriteMovies(userInfo.id);

    return (
        <section>
            <FavoriteMain
                username={userInfo.username}
                userId={userInfo.id}
                listFavoriteMovies={favoriteMovies}
                listPopularMovies={popularMovies.data}
            />
        </section>
    );
};

export default FavoritePage;
