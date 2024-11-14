'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';
import { addHistoryKeyword, fetchHistoryKeywords, fetchRecommendKeywords } from '@/services/recommendServices';
import { History, LoaderCircle, SearchIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu-custom';
import { Keyword } from '@/types/keyword';

type Props = {
    className?: string;
};

function Search({ className }: Props) {
    const params = useParams();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState(() =>
        params?.q === undefined ? '' : decodeURIComponent(params?.q as string),
    );

    const [searchResult, setSearchResult] = useState<Array<Keyword>>([]);
    const [historyKeywords, setHistoryKeywords] = useState<Array<Keyword>>([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);

    const debounced = useDebounce<string>(searchValue, 500);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        if (inputRef.current !== null) {
            inputRef.current.focus();
        }
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        const handleFocusSearchBar = (e: KeyboardEvent) => {
            if (e.key === '/') {
                e.preventDefault();
                inputRef.current?.focus();
                setShowResult(true);
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
                e.preventDefault();
                handleClear();
            }
        };

        document.addEventListener('keydown', handleFocusSearchBar);
        return () => {
            document.removeEventListener('keydown', handleFocusSearchBar);
        };
    }, [inputRef]);

    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }

        const fetchApi = async () => {
            if (loading) {
                return;
            }
            setLoading(true);

            const recommendKeywords = await fetchRecommendKeywords(debounced, historyKeywords);

            setSearchResult(recommendKeywords);

            setLoading(false);
        };

        if (searchResult.some((r) => r.keyword === debounced)) {
            return;
        }

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const indexSearchKeyword = searchResult.map((k) => k.keyword).indexOf(searchValue);
        if (e.key === 'ArrowDown') {
            if (indexSearchKeyword === searchResult.length - 1) {
                setSearchValue(searchResult[0].keyword);
            } else if (indexSearchKeyword + 1 < searchResult.length) {
                setSearchValue(searchResult[indexSearchKeyword + 1].keyword);
            }
        } else if (e.key === 'ArrowUp') {
            if (indexSearchKeyword === 0) {
                setSearchValue(searchResult[searchResult.length - 1].keyword);
            } else {
                setSearchValue(searchResult[indexSearchKeyword - 1].keyword);
            }
        } else if (e.key === 'Enter') {
            addHistoryKeyword(searchValue);
            router.replace('/search/' + searchValue);
            setShowResult(false);
            e.preventDefault();
        }
    };

    const fetchHistory = async () => {
        if (historyKeywords.length === 0) {
            const res = await fetchHistoryKeywords();
            setHistoryKeywords(res);
            setSearchResult(res);
        } else {
            setSearchResult(historyKeywords);
        }
    };

    const handleSearchFocus = async () => {
        setShowResult(true);
        fetchHistory();
    };

    return (
        <form
            className={cn(
                'relative w-96 rounded-xl border-2 border-gray-300 px-3 focus-within:border-primary max-sm:w-64',
                { [className as string]: className },
            )}
        >
            <div className="relative flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 dark:fill-white"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
                <Input
                    ref={inputRef}
                    className="no-focus mr-4 border-none bg-transparent outline-none"
                    value={searchValue}
                    placeholder="Search..."
                    onFocus={handleSearchFocus}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleOnKeyDown}
                />
                {showResult && searchResult && searchResult.length > 0 && (
                    <DropdownMenu
                        className="absolute -left-4 top-12 w-96 max-sm:w-64"
                        title="Movie tile"
                        onOutSideClick={handleHideResult}
                    >
                        {/* <div className="mb-2 flex flex-wrap items-center gap-2 py-2">
                            {historyKeywords.map((keywordHistory, index) => (
                                <div
                                    className="w-fit cursor-pointer rounded-full border px-2 py-1 hover:bg-accent dark:border-gray-700"
                                    key={keywordHistory + index}
                                    onClick={() => {
                                        setSearchValue(keywordHistory);
                                        setShowResult(false);
                                        router.replace('/search/' + keywordHistory);
                                    }}
                                >
                                    <div className="flex items-center gap-x-1">
                                        <History className="size-5 text-gray-500" />
                                        {keywordHistory}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <DropdownMenuSeparator /> */}
                        {searchResult.map((result, index) => (
                            <DropdownMenuItem
                                key={result.keyword + index}
                                isFocused={searchValue === result.keyword}
                                onClick={() => {
                                    setSearchValue(result.keyword);
                                    setShowResult(false);
                                    router.replace('/search/' + result.keyword);
                                }}
                            >
                                <div className="flex items-center gap-x-3">
                                    {result.isHistory ? (
                                        <History className="size-5 text-gray-500" />
                                    ) : (
                                        <SearchIcon className="size-5 text-gray-500" />
                                    )}
                                    {result.keyword}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenu>
                )}
                {loading && <LoaderCircle className="size-6 animate-spin dark:text-white" />}
                {searchValue && !loading && (
                    <button className="absolute right-0" onClick={handleClear}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </form>
    );
}

export default Search;
