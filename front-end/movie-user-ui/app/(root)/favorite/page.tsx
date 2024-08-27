'use client';

import { cn, timeAgo } from '@/lib/utils';
import { fetchUser } from '@/services/userServices';
import { currentUser } from '@clerk/nextjs/server';
import { Circle, CircleCheck, MonitorCog, MoveLeft, Play, Triangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import MovieCardItemHorizontal from '@/components/cards/MovieCardItemHorizontal';

type Props = {};

const listColors = [
    {
        name: 'primary',
        background: 'bg-primary',
        text: 'text-primary',
        fill: 'fill-primary',
    },
    {
        name: 'red',
        background: 'bg-red-500',
        text: 'text-red-500',
        fill: 'fill-red-500',
    },
    {
        name: 'blue',
        background: 'bg-blue-500',
        text: 'text-blue-500',
        fill: 'fill-blue-500',
    },
    {
        name: 'green',
        background: 'bg-green-500',
        text: 'text-green-500',
        fill: 'fill-green-500',
    },
    {
        name: 'orange',
        background: 'bg-orange-500',
        text: 'text-orange-500',
        fill: 'fill-orange-500',
    },
];

const FavoritePage = (props: Props) => {
    // const user = await currentUser();

    // if (!user) return null;

    // const userInfo = await fetchUser(user.id);

    // if (!userInfo?.onboarded) redirect('/onboarding');
    const [activeSlide, setActiveSlide] = useState(0);
    const [activeColor, setActiveColor] = useState(0);
    let sliderRef = useRef<Slider | null>(null);

    const settings = useMemo(
        () => ({
            className: 'center',
            centerMode: true,
            infinite: false,
            focusOnSelect: true,
            centerPadding: '60px',
            slidesToShow: 1,
            speed: 500,
            arrows: false,
            beforeChange: (current: number, next: number) => setActiveSlide(next),
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        centerPadding: '100px',
                    },
                },
            ],
        }),
        [],
    );

    const generateImagesSlide = useCallback(() => {
        let results = [];
        for (let i = 0; i < 10; i++) {
            results.push(
                <div
                    key={i}
                    className={cn('scale-90 transition-all duration-500 ease-linear', {
                        'scale-100': i === activeSlide,
                    })}
                >
                    <div className="relative mb-3">
                        <Image
                            src="https://i.pinimg.com/originals/39/ae/2b/39ae2b2ab480cb2e8f6ea7e4e520a4fa.jpg"
                            alt="poster"
                            width={300}
                            height={330}
                            quality={100}
                            className="h-72 w-full rounded-xl"
                        />
                        <div className="absolute bottom-3 right-3 cursor-pointer rounded-xl bg-white p-2">
                            <Play className="size-5 dark:text-black" />
                        </div>
                    </div>
                    <div
                        className={cn('opacity-0 transition-all duration-500 ease-linear', {
                            'opacity-100': i === activeSlide,
                        })}
                    >
                        <h2 className="line-clamp-1 text-lg font-bold">Blue archive</h2>
                        <p className="text-sm text-gray-500">Action, Comedy, Romantic</p>
                    </div>
                </div>,
            );
        }
        return results;
    }, [activeSlide]);

    const renderDots = () => {
        let dotElements = [];
        for (let i = 0; i < 10; i++) {
            dotElements.push(
                <div
                    key={i}
                    className={cn(
                        'size-4 cursor-pointer rounded-md border border-primary transition-all duration-300 ease-linear',
                        { 'rotate-180 bg-primary': i === activeSlide },
                    )}
                    onClick={() => sliderRef.current?.slickGoTo(i)}
                />,
            );
        }
        return dotElements;
    };

    const handleNextSlide = () => {
        if (sliderRef.current !== null) {
            sliderRef.current.slickNext();
        }
    };

    const handlePrevSlide = () => {
        if (sliderRef.current !== null) {
            sliderRef.current.slickPrev();
        }
    };

    return (
        <div className="p-4">
            <div className="mb-5">
                <h2 className="text-3xl font-bold">Favorite</h2>
                <p className="text-gray-400">Your favorite movie here!</p>
            </div>
            <div className="flex gap-x-10 max-md:flex-col max-md:gap-0">
                <div className="slider-container flex w-1/2 flex-none max-md:mb-5 max-md:w-full">
                    <div className="flex flex-1 flex-col items-center justify-between px-4 py-3">
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div className="flex w-fit cursor-pointer justify-center rounded-lg border border-primary bg-accent p-2.5 transition-all duration-200 ease-linear active:scale-75 dark:border-none">
                                        <MoveLeft className="text-primary dark:text-white" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="dark:border-none">
                                    <p>Back</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="flex flex-col gap-y-2">
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="flex w-fit cursor-pointer justify-center rounded-lg border border-primary bg-accent p-2.5 transition-all duration-200 ease-linear active:scale-75 dark:border-none"
                                            onClick={handleNextSlide}
                                        >
                                            <Triangle className="rotate-90 text-primary dark:text-white" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="dark:border-none">
                                        <p>Next</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="flex w-fit cursor-pointer justify-center rounded-lg border border-primary bg-accent p-2.5 transition-all duration-200 ease-linear active:scale-75 dark:border-none"
                                            onClick={handlePrevSlide}
                                        >
                                            <Triangle className="-rotate-90 text-primary dark:text-white" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="dark:border-none">
                                        <p>Prev</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <div className="w-4/6 max-[1200px]:w-5/6">
                        <Slider ref={sliderRef} {...settings} className="w-full">
                            {generateImagesSlide()}
                        </Slider>
                        <div className="mt-5 hidden items-center gap-x-1 px-4 py-3 max-[1200px]:flex">
                            {renderDots()}
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-y-1 px-4 py-3 max-[1200px]:hidden">
                        {renderDots()}
                    </div>
                </div>
                <div className="flex max-h-96 flex-grow flex-col gap-y-3 overflow-y-scroll max-md:p-7 max-sm:p-3">
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                    <MovieCardItemHorizontal />
                </div>
            </div>
        </div>
    );
};

export default FavoritePage;
