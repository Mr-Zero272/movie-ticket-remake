'use client';

import MovieCardItemHorizontal from '@/components/cards/MovieCardItemHorizontal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchInputHidden from '@/components/ui/search-hidden-input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, timeAgo } from '@/lib/utils';
import { type FavoriteMovieDtos, Movie } from '@/types/movie';
import {
    Column,
    ColumnDef,
    FilterFn,
    SortingFn,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    sortingFns,
    useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Heart, Logs, SearchX, SquareChevronRight } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import FavoriteSuggestion from './favorite-suggestion';

import { RankingInfo, compareItems, rankItem } from '@tanstack/match-sorter-utils';

declare module '@tanstack/react-table' {
    //add fuzzy filter to the filterFns
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
        itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0;

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(rowA.columnFiltersMeta[columnId]?.itemRank!, rowB.columnFiltersMeta[columnId]?.itemRank!);
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue();

    return (
        <DebouncedInput
            type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Search...`}
            className="w-36 rounded border shadow"
        />
    );
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    widthResponsive,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
    widthResponsive?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleInputChange = (value: string | number) => {
        setValue(value);
    };

    return (
        <SearchInputHidden {...props} value={value} onChange={handleInputChange} widthResponsive={widthResponsive} />
    );
}

type Props = {
    username: string;
    userId: string;
    listPopularMovies: Movie[];
    listFavoriteMovies: FavoriteMovieDtos[];
};

const FavoriteMain = ({ username, userId, listFavoriteMovies, listPopularMovies }: Props) => {
    const [searchValue, setSearchValue] = useState('');
    const [isSideOpen, setIsSideOpen] = useState(true);
    const [listMovie, setListMovie] = useState<FavoriteMovieDtos[]>(listFavoriteMovies);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = useMemo<ColumnDef<FavoriteMovieDtos, any>[]>(
        () => [
            {
                accessorKey: 'title',
                cell: (info) => info.getValue(),
                filterFn: 'fuzzy',
                sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
            },
            {
                accessorFn: (row) => row.dateAdded, //note: normal non-fuzzy filter column - case sensitive
                id: 'dateAdded',
                cell: (info) => info.getValue(),
                header: () => <span>Date added</span>,
                filterFn: 'includesString', //note: normal non-fuzzy filter column - case insensitive
            },
            {
                accessorFn: (row) => row.runtime,
                id: 'duration',
                header: 'Duration',
                cell: (info) => info.getValue(),
            },
        ],
        [],
    );

    const table = useReactTable({
        data: listMovie,
        columns: columns,
        filterFns: {
            fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
        },
        state: {
            // columnFilters,
            sorting,
            globalFilter,
        },
        // onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    });

    //apply the fuzzy sort if the fullName column is being filtered
    useEffect(() => {
        if (table.getState().columnFilters[0]?.id === 'fullName') {
            if (table.getState().sorting[0]?.id !== 'fullName') {
                table.setSorting([{ id: 'fullName', desc: false }]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table.getState().columnFilters[0]?.id]);

    const handleOpenSide = () => {
        setIsSideOpen((prev) => !prev);
    };

    const handleSortChange = (columnId: string) => {
        if (columnId === 'none') {
            setSorting([]);
        }

        if (sorting.length !== 0 && sorting[0].id === columnId && sorting[0].desc) {
            setSorting([]);
            return;
        }

        if (sorting.length !== 0 && sorting[0].id === columnId) {
            setSorting([{ id: columnId, desc: true }]);
            return;
        }
        setSorting([{ id: columnId, desc: false }]);
    };

    return (
        <>
            <div className="relative flex gap-x-2 p-4">
                <article className="max-h-[33rem] min-h-96 flex-1 overflow-x-hidden overflow-y-scroll rounded-lg max-md:max-h-[100rem]">
                    <div className="flex h-56 items-end gap-x-5 rounded-t-lg bg-[#0093E9] bg-[linear-gradient(160deg,#0093E9_0%,#80D0C7_100%)] p-5">
                        <div className="w-fit rounded-md bg-[#0093E9] bg-[linear-gradient(160deg,#0093E9_0%,#80D0C7_50%,#ffffff_100%)] p-16 max-md:p-10">
                            <Heart className="size-14 fill-white text-white dark:fill-black dark:text-black" />
                        </div>
                        <div>
                            <p className="text-sm text-white dark:text-black">List</p>
                            <h2 className="text-5xl font-bold text-white dark:text-black max-md:text-xl">
                                Liked Movies
                            </h2>
                            <p className="text-sm text-white dark:text-black">
                                <span>{username}</span> - <span>{listFavoriteMovies.length} movie(s)</span>
                            </p>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center justify-end gap-x-5">
                            {listFavoriteMovies.length !== 0 && (
                                <>
                                    <DebouncedInput
                                        value={globalFilter ?? ''}
                                        onChange={(value) => setGlobalFilter(String(value))}
                                        placeholder="Search all columns..."
                                        widthResponsive="max-md:w-32"
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center gap-x-2">
                                                <p className="capitalize">
                                                    {sorting?.length !== 0 ? sorting[0].id : 'Sort'}
                                                </p>{' '}
                                                <Logs />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 dark:border-none">
                                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup
                                                value={sorting?.length !== 0 ? sorting[0].id : 'none'}
                                                onValueChange={handleSortChange}
                                            >
                                                <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="title">
                                                    Title{' '}
                                                    {sorting.length !== 0 && sorting[0].id === 'title' ? (
                                                        sorting[0].desc ? (
                                                            <ChevronDown className="inline-block size-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronUp className="inline-block size-4 text-gray-500" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="dateAdded">
                                                    Date Added{' '}
                                                    {sorting.length !== 0 && sorting[0].id === 'dateAdded' ? (
                                                        sorting[0].desc ? (
                                                            <ChevronDown className="inline-block size-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronUp className="inline-block size-4 text-gray-500" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="duration">
                                                    Duration{' '}
                                                    {sorting.length !== 0 && sorting[0].id === 'duration' ? (
                                                        sorting[0].desc ? (
                                                            <ChevronDown className="inline-block size-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronUp className="inline-block size-4 text-gray-500" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                            <div className="max-[1200px]:hidden">
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <SquareChevronRight className="cursor-pointer" onClick={handleOpenSide} />
                                        </TooltipTrigger>
                                        <TooltipContent className="dark:border-none">
                                            <p>Open popular movie</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <div className="">
                            {listMovie.length !== 0 ? (
                                <Table>
                                    <TableCaption>A list of your favorite movies.</TableCaption>
                                    <TableHeader className="sticky top-0">
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                <TableHead className="w-10 max-[450px]:hidden">#</TableHead>
                                                <TableHead
                                                    className={cn('', {
                                                        'cursor-pointer select-none':
                                                            headerGroup.headers[0].column.getCanSort(),
                                                    })}
                                                    onClick={headerGroup.headers[0].column.getToggleSortingHandler()}
                                                >
                                                    Title{' '}
                                                    {{
                                                        asc: (
                                                            <ChevronUp className="inline-block size-4 text-gray-500" />
                                                        ),
                                                        desc: (
                                                            <ChevronDown className="inline-block size-4 text-gray-500" />
                                                        ),
                                                    }[headerGroup.headers[0].column.getIsSorted() as string] ?? null}
                                                </TableHead>
                                                <TableHead
                                                    className={cn('max-sm:hidden', {
                                                        'cursor-pointer select-none':
                                                            headerGroup.headers[1].column.getCanSort(),
                                                    })}
                                                    onClick={headerGroup.headers[1].column.getToggleSortingHandler()}
                                                >
                                                    Date added{' '}
                                                    {{
                                                        asc: (
                                                            <ChevronUp className="inline-block size-4 text-gray-500" />
                                                        ),
                                                        desc: (
                                                            <ChevronDown className="inline-block size-4 text-gray-500" />
                                                        ),
                                                    }[headerGroup.headers[1].column.getIsSorted() as string] ?? null}
                                                </TableHead>
                                                <TableHead
                                                    className={cn('text-right max-[450px]:hidden', {
                                                        'cursor-pointer select-none':
                                                            headerGroup.headers[2].column.getCanSort(),
                                                    })}
                                                    onClick={headerGroup.headers[2].column.getToggleSortingHandler()}
                                                >
                                                    Duration{' '}
                                                    {{
                                                        asc: (
                                                            <ChevronUp className="inline-block size-4 text-gray-500" />
                                                        ),
                                                        desc: (
                                                            <ChevronDown className="inline-block size-4 text-gray-500" />
                                                        ),
                                                    }[headerGroup.headers[2].column.getIsSorted() as string] ?? null}
                                                </TableHead>
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.map((row, index) => {
                                            return (
                                                <TableRow key={row.id}>
                                                    <TableCell className="font-medium max-[450px]:hidden">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <MovieCardItemHorizontal
                                                            movieId={row.original.movieId}
                                                            userId={userId}
                                                            title={row.original.title}
                                                            poster={row.original.posterPath}
                                                            runtime={row.original.runtime}
                                                            firstGenre={format(row.original.releaseDate, 'dd MMM')}
                                                            love={true}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="max-sm:hidden">
                                                        {timeAgo(row.original.dateAdded)}
                                                    </TableCell>
                                                    <TableCell className="text-right max-[450px]:hidden">
                                                        {row.original.runtime}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center gap-y-3 text-center text-gray-500">
                                    <SearchX strokeWidth={1} className="size-20 text-primary" />
                                    <h2 className="text-3xl font-bold">Whoops!</h2>
                                    <p>It seems like you do not have any favorite movies here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
                {isSideOpen && <FavoriteSuggestion listSuggestMovie={listPopularMovies} onClose={handleOpenSide} />}
            </div>
        </>
    );
};

export default FavoriteMain;
