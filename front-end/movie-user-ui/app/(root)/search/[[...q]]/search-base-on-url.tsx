'use client';
import MovieCardItemVertical from '@/components/cards/MovieCardItemVertical';
import ScrollTopButton from '@/components/shared/ScrollTopButton';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { paginate } from '@/lib/utils';
import { fetchMovies } from '@/services/movieServices';
import { Genre } from '@/types/movie';
import { PaginationMovie } from '@/types/pagination';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

type LabelValue = {
    label: string;
    value: string;
};

type FiltersType = 'page' | 'size' | 'sort' | 'status' | 'originalLanguage' | 'genreId';

type Props = {
    userId: string;
    sortData: LabelValue[];
    genreData: Genre[];
    languageData: LabelValue[];
    statusData: LabelValue[];
    sizeData: LabelValue[];
};

const SearchBaseOnUrl = (props: Props) => {
    const params = useParams();
    const router = useRouter();
    const searchParam = useSearchParams();
    const [movieData, setMovieData] = useState<PaginationMovie | null>(null);
    const [filters, setFilters] = useState(() => ({
        page: 1,
        size: 10,
        sort: 'none',
        status: 'none',
        originalLanguage: 'none',
        genreId: 0,
    }));
    const [loading, setLoading] = useState(false);
    let q = params.q === undefined ? '' : decodeURIComponent(params?.q as string);

    const isDefaultFilter = () => {
        if (
            filters.page === 1 &&
            filters.size === 10 &&
            filters.sort === '' &&
            filters.status === '' &&
            filters.originalLanguage === '' &&
            filters.genreId === 0
        ) {
            return true;
        }
        return false;
    };

    const encodeSpParam = ({
        page = 1,
        size = 10,
        sort = 'none',
        status = 'none',
        originalLanguage = 'none',
        genreId = 0,
    }: {
        page?: number;
        size?: number;
        sort?: string;
        status?: string;
        originalLanguage?: string;
        genreId?: number;
    }) => {
        return encodeURIComponent(
            Object.entries({ page, size, sort, status, originalLanguage, genreId })
                .map(([_, value]) => `${value}`)
                .join('|'),
        );
    };

    const handleChangeFilter = (value: any, type: FiltersType) => {
        let sp = '';
        if (type === 'page') {
            sp = encodeSpParam({ ...filters, page: value });
        } else {
            sp = encodeSpParam({ ...filters, [type]: value, page: 1 });
        }

        if (q === '' || q === undefined || q === 'undefined') {
            router.push('/search?sp=' + sp);
        } else {
            router.push(`/search/${q}?sp=${sp}`);
        }
    };

    useEffect(() => {
        const decodeSpParamAndFetchData = async () => {
            if (loading) return;
            const spParam = searchParam.get('sp');
            if (spParam) {
                const filterValues = decodeURIComponent(spParam).split('|');
                const filtersObj = {
                    page: +filterValues[0],
                    size: +filterValues[1],
                    sort: filterValues[2],
                    status: filterValues[3] === '' ? 'none' : filterValues[3],
                    originalLanguage: filterValues[4] === '' ? 'none' : filterValues[4],
                    genreId: +filterValues[5],
                };
                const res = await fetchMovies({
                    q,
                    ...filtersObj,
                });
                setMovieData(res);
                setFilters(filtersObj);
            } else {
                const res = await fetchMovies({ q: q, ...filters });
                setMovieData(res);
            }
            setLoading(false);
        };
        setLoading(true);
        decodeSpParamAndFetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam]);

    const displayFirstGenre = (genres: Genre[]) => {
        if (genres.length === 0) {
            return 'unknown';
        }

        if (filters.genreId !== 0) {
            const activeGenre = genres.find((g) => g.id === filters.genreId);
            if (activeGenre) {
                return activeGenre.name;
            }
        }
        return genres[0].name;
    };

    const { current, prev, next, items } = useMemo(() => {
        if (movieData) {
            return paginate({ current: movieData.page, max: movieData.totalPages });
        }
        return { current: 1, prev: null, next: null, items: [1] };
    }, [movieData]);

    return (
        <div>
            <ScrollTopButton />
            <div className="mb-5 grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2">
                <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                    <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                        SORT
                    </label>
                    <Select value={filters.sort} onValueChange={(sortValue) => handleChangeFilter(sortValue, 'sort')}>
                        <SelectTrigger className="no-focus border-none bg-transparent outline-none" id="choose-date">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="border-none outline-none">
                            {props.sortData.map((sort) => (
                                <SelectItem key={sort.value} value={sort.value} className="capitalize">
                                    {sort.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                    <label htmlFor="choose-cinema-type" className="mb-3 text-xs text-gray-400">
                        CHOOSE GENRE
                    </label>
                    <Select
                        value={filters.genreId + ''}
                        onValueChange={(genreId) => handleChangeFilter(+genreId, 'genreId')}
                    >
                        <SelectTrigger
                            className="no-focus border-none bg-transparent outline-none"
                            id="choose-cinema-type"
                        >
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="border-none outline-none">
                            {props.genreData.map((genre) => (
                                <SelectItem key={genre.id} value={genre.id.toString()} className="capitalize">
                                    {genre.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                    <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                        Language
                    </label>
                    <Select
                        value={filters.originalLanguage}
                        onValueChange={(originalLanguageValue) =>
                            handleChangeFilter(originalLanguageValue, 'originalLanguage')
                        }
                    >
                        <SelectTrigger className="no-focus border-none bg-transparent outline-none" id="choose-date">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="border-none outline-none">
                            {props.languageData.map((language) => (
                                <SelectItem key={language.value} value={language.value} className="capitalize">
                                    {language.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                    <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                        Status
                    </label>
                    <Select
                        value={filters.status}
                        onValueChange={(statusValue) => handleChangeFilter(statusValue, 'status')}
                    >
                        <SelectTrigger className="no-focus border-none bg-transparent outline-none" id="choose-date">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="border-none outline-none">
                            {props.statusData.map((status) => (
                                <SelectItem key={status.value} value={status.value} className="capitalize">
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                    <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                        Size
                    </label>
                    <Select
                        value={filters.size.toString()}
                        onValueChange={(sizeValue) => handleChangeFilter(+sizeValue, 'size')}
                    >
                        <SelectTrigger className="no-focus border-none bg-transparent outline-none" id="choose-date">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="border-none outline-none">
                            {props.sizeData.map((siz) => (
                                <SelectItem key={siz.value} value={siz.value} className="capitalize">
                                    {siz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Pagination className="mb-5 md:hidden">
                <PaginationContent className="flex flex-wrap justify-center">
                    <PaginationItem>
                        <PaginationPrevious
                            className="cursor-pointer select-none"
                            onClick={() => {
                                if (prev !== null) {
                                    handleChangeFilter(+prev, 'page');
                                }
                            }}
                        />
                    </PaginationItem>
                    {items.map((item, index) => {
                        if (item === '...') {
                            return (
                                <PaginationItem
                                    className="cursor-not-allowed select-none"
                                    key={index}
                                    onClick={() => {}}
                                >
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }
                        return (
                            <PaginationItem className="cursor-pointer select-none" key={index}>
                                <PaginationLink
                                    isActive={+item === filters.page}
                                    onClick={() => handleChangeFilter(+item, 'page')}
                                >
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer select-none"
                            onClick={() => {
                                if (next !== null) {
                                    handleChangeFilter(+next, 'page');
                                }
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <div className="grid grid-cols-5 gap-x-3 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2">
                {loading ? (
                    <>
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                    </>
                ) : movieData && movieData.data.length !== 0 ? (
                    movieData.data.map((movie) => (
                        <MovieCardItemVertical
                            key={movie.id}
                            userId={props.userId}
                            movieId={movie.id}
                            poster={movie.posterPath}
                            title={movie.title}
                            runtime={movie.runtime}
                            firstGenre={displayFirstGenre(movie.genres)}
                            love={movie.userFavoriteMovies.some((m) => m.userId === props.userId)}
                        />
                    ))
                ) : (
                    <div>No result...</div>
                )}
            </div>

            <Pagination>
                <PaginationContent className="flex flex-wrap justify-center">
                    <PaginationItem>
                        <PaginationPrevious
                            className="cursor-pointer select-none"
                            onClick={() => {
                                if (prev !== null) {
                                    handleChangeFilter(+prev, 'page');
                                }
                            }}
                        />
                    </PaginationItem>
                    {items.map((item, index) => {
                        if (item === '...') {
                            return (
                                <PaginationItem
                                    className="cursor-not-allowed select-none"
                                    key={index}
                                    onClick={() => {}}
                                >
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }
                        return (
                            <PaginationItem className="cursor-pointer select-none" key={index}>
                                <PaginationLink
                                    isActive={+item === filters.page}
                                    onClick={() => handleChangeFilter(+item, 'page')}
                                >
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer select-none"
                            onClick={() => {
                                if (next !== null) {
                                    handleChangeFilter(+next, 'page');
                                }
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default SearchBaseOnUrl;
