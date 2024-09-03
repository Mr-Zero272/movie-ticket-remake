'use client';
import { Search } from 'lucide-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

type Props = {
    value: string | number;
    onChange: (e: string | number) => void;
    widthResponsive?: string;
    className?: string;
};

const SearchInputHidden = ({ value, onChange, widthResponsive, className }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const searchInputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
                // onOutSideClick();
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const widthSearch = width ? `w-${width}` : 'w-60'

    return (
        <div className={`flex items-center ${className ?? ''}`} ref={searchInputRef}>
            <Search
                className={cn('cursor-pointer opacity-100 transition-all duration-300 ease-linear', {
                    'hidden opacity-0': isOpen,
                })}
                onClick={() => setIsOpen((prev) => !prev)}
            />
            <div
                className={cn(
                    'flex w-0 items-center border-b border-gray-500 transition-all duration-300 ease-linear focus-within:border-primary',
                    {
                        [`w-60 ${widthResponsive ? widthResponsive : ''}`]: isOpen,
                    },
                )}
            >
                <Search className="cursor-pointer" onClick={() => setIsOpen((prev) => !prev)} />
                <Input
                    className="no-focus mr-4 border-none bg-transparent outline-none focus:border-b"
                    placeholder="Search..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default SearchInputHidden;
