import { fetchListFavoriteMovies } from '@/services/favoriteServices';
import { fetchPopularMovies } from '@/services/movieServices';
import { fetchUser } from '@/services/userServices';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import FavoriteMain from './favorite-main';

type Props = {};

const FavoritePage = async (props: Props) => {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    const popularMovies = await fetchPopularMovies({ page: 3, size: 4, sort: 'releaseDate', genreId: 0 });
    const favoriteMovies = await fetchListFavoriteMovies(userInfo.userClerkId);

    return (
        <section>
            <FavoriteMain
                username={userInfo.username}
                userId={userInfo.userClerkId}
                listFavoriteMovies={favoriteMovies}
                listPopularMovies={popularMovies.data}
            />
        </section>
    );
};

export default FavoritePage;
