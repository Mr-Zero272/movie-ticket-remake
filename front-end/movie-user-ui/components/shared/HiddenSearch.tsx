import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';
import Search from './Search';

type Props = {};

function HiddenSearch({}: Props) {
    const [open, setOpen] = useState<boolean>(false);

    const handleOpenSearch = () => {
        setOpen((prev) => !prev);
    };

    return (
        <div className="cursor-pointer rounded-lg p-2 hover:bg-accent" onClick={() => setOpen(true)}>
            <SearchIcon className="inline-block size-6 text-gray-500" />
            {open && (
                <div className="absolute right-0 top-0 z-30 flex h-16 w-full items-center gap-x-5 bg-white p-4 dark:bg-black">
                    <div
                        className="rounded-full p-2 text-gray-500 hover:bg-accent"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false);
                        }}
                    >
                        <ArrowLeftIcon className="inline-block size-6" />
                    </div>
                    <Search className="" />
                </div>
            )}
        </div>
    );
}

export default HiddenSearch;
