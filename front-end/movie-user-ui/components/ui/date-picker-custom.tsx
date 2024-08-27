'use client';
import React, { useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { cn, generateDateRangeNext } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    initialDate: string;
    className?: string;
    onChooseDate: (date: string) => void;
};

const DatePickerCustom = ({ initialDate, className, onChooseDate }: Props) => {
    const itemsRef = useRef<null | HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const moveDistance = useRef(0);

    const listDate = useMemo(() => generateDateRangeNext(format(initialDate, 'yyyy-MM-dd'), 100), []);
    const [activeDate, setActiveDate] = useState(initialDate);

    const handleDateClick = (date: string) => {
        if (moveDistance.current < 5) {
            setActiveDate(date);
            onChooseDate(date);
        }
    };

    const handleClickNextDate = () => {
        if (itemsRef.current !== null) {
            itemsRef.current.scrollBy({ left: +145, behavior: 'smooth' });
        }
    };

    const handleClickPreDate = () => {
        if (itemsRef.current !== null) {
            itemsRef.current.scrollBy({ left: -145, behavior: 'smooth' });
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsMouseDown(true);
        if (itemsRef.current !== null) {
            setStartX(e.pageX - itemsRef.current.offsetLeft);
            setScrollLeft(itemsRef.current.scrollLeft);
        }
        moveDistance.current = 0;
    };

    const handleMouseLeave = () => {
        setIsMouseDown(false);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsMouseDown(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMouseDown) return;
        e.preventDefault();
        if (itemsRef.current !== null) {
            const x = e.pageX - itemsRef.current?.offsetLeft;
            const walk = (x - startX) * 1;
            itemsRef.current.scrollLeft = scrollLeft - walk;
            moveDistance.current += Math.abs(walk);
        }
    };
    return (
        <div className={`relative ${className}`}>
            <div className="mb-3 flex w-full items-center justify-between">
                <h4 className="font-semibold">{format(new Date(activeDate), 'EEEE, dd MMMM')}</h4>
                <div className="flex">
                    <button className="rounded-full p-1.5 hover:bg-accent active:scale-90" onClick={handleClickPreDate}>
                        <ChevronLeft />
                    </button>
                    <button
                        className="rounded-full p-1.5 hover:bg-accent active:scale-90"
                        onClick={handleClickNextDate}
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
            <div
                className="no-scrollbar mb-3 flex overflow-auto rounded-lg"
                ref={itemsRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {listDate.map((date) => {
                    const active = date === activeDate;
                    return (
                        <div
                            key={date}
                            className={cn('cursor-pointer select-none rounded-lg p-2 text-center text-sm', {
                                'bg-primary': active,
                            })}
                            onClick={() => handleDateClick(date)}
                        >
                            <div className={cn('mb-2 text-gray-500', { 'text-white': active })}>
                                {format(date, 'EEE')}
                            </div>
                            <div
                                className={cn('rounded-lg px-2 py-1 font-semibold', {
                                    'bg-white text-primary': active,
                                })}
                            >
                                {format(date, 'dd/MM')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DatePickerCustom;
