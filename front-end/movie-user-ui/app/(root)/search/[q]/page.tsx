import FilterMovie from '@/components/shared/FilterMovie';
import { fetchAllGenres, fetchMovies } from '@/services/movieServices';

type Props = {
    params: { q: string };
};

const SearchPage = async ({ params }: Props) => {
    const popularMovies = await fetchMovies({
        q: params.q,
        originalLanguage: 'en',
        genreId: 0,
        status: 'Released',
        sort: 'none',
        size: 10,
        page: 1,
    });
    let genreData = await fetchAllGenres();
    genreData = [{ id: 0, name: 'None' }, ...genreData];
    return (
        <div className="p-4">
            <FilterMovie
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
                    { label: 'Released', value: 'Released' },
                    { label: 'Upcoming', value: 'Upcoming' },
                ]}
                languageData={[
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
            />
        </div>
    );
};

export default SearchPage;
