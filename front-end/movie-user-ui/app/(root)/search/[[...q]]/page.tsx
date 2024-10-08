import FilterMovie from '@/components/shared/FilterMovie';
import { currentUser } from '@/services/authServices';
import { fetchAllGenres, fetchMovies } from '@/services/movieServices';
import { redirect } from 'next/navigation';
import SearchBaseOnUrl from './search-base-on-url';

type Props = {
    params: { q: string };
};

const SearchPage = async ({ params }: Props) => {
    const userInfo = await currentUser();

    if (userInfo === undefined) {
        throw new Error('Error form user server!');
    }

    if (!userInfo?.onboarded) redirect('/onboarding');

    let genreData = await fetchAllGenres();
    genreData = [{ id: 0, name: 'None' }, ...genreData];
    return (
        <div className="p-4">
            {/* <FilterMovie
                userId={userInfo.id}
                type="normal"
                initialData={popularMovies}
                sortData={[
                    { label: 'None', value: 'none' },
                    { label: 'Title', value: 'title' },
                    { label: 'Release data', value: 'releaseDate' },
                    { label: 'Budget', value: 'budget' },
                ]}
                genreData={genreData}
                statusData={[
                    { label: 'None', value: 'none' },
                    { label: 'Released', value: 'Released' },
                    { label: 'Upcoming', value: 'Upcoming' },
                ]}
                languageData={[
                    { label: 'None', value: 'none' },
                    { label: 'English', value: 'en' },
                    { label: 'Japanese', value: 'jp' },
                ]}
                sizeData={[
                    { label: 'Size 10', value: '10' },
                    { label: 'Size 20', value: '20' },
                    { label: 'Size 30', value: '30' },
                    { label: 'Size 50', value: '50' },
                ]}
                pagination
            /> */}
            <SearchBaseOnUrl
                userId={userInfo.id}
                sortData={[
                    { label: 'None', value: 'none' },
                    { label: 'Title', value: 'title' },
                    { label: 'Release data', value: 'releaseDate' },
                    { label: 'Budget', value: 'budget' },
                ]}
                genreData={genreData}
                statusData={[
                    { label: 'None', value: 'none' },
                    { label: 'Released', value: 'Released' },
                    { label: 'Upcoming', value: 'Upcoming' },
                ]}
                languageData={[
                    { label: 'None', value: 'none' },
                    { label: 'English', value: 'en' },
                    { label: 'Japanese', value: 'jp' },
                ]}
                sizeData={[
                    { label: 'Size 10', value: '10' },
                    { label: 'Size 20', value: '20' },
                    { label: 'Size 30', value: '30' },
                    { label: 'Size 50', value: '50' },
                ]}
            />
        </div>
    );
};

export default SearchPage;
