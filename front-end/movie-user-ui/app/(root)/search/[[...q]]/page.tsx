import FilterMovie from '@/components/shared/FilterMovie';
import { currentUser } from '@/services/authServices';
import { fetchAllGenres, fetchMovies } from '@/services/movieServices';
import { redirect } from 'next/navigation';
import SearchBaseOnUrl from './search-base-on-url';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ q: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // read route params
    const query = (await params).q;
    const q = query ? query : 'Search';

    return {
        title: q + ' - Moon Movie',
        description: 'Choose your seats real time here',
    };
}

const SearchPage = async ({ params }: Props) => {
    const userInfo = await currentUser();

    let userId = '@';

    if (userInfo !== undefined) {
        userId = userInfo.id;
        if (!userInfo?.onboarded) redirect('/onboarding');
    }

    let genreData = await fetchAllGenres();
    genreData = [{ id: 0, name: 'None' }, ...genreData];
    return (
        <div className="p-4">
            <SearchBaseOnUrl
                userId={userId}
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
