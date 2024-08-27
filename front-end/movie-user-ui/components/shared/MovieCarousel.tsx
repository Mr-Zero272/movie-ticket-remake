'use client';

import { cn } from '@/lib/utils';
import { Movie } from '@/types/movie';
import { format } from 'date-fns';
import Autoplay from 'embla-carousel-autoplay';
import { MoveRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CarouselApi } from '../ui/carousel';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const colors = [
    'bg-indigo-400',
    'bg-yellow-400',
    'bg-red-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-pink-400',
    'bg-purple-400',
];

type Props = {
    data: Movie[];
};

function MovieCarousel({ data }: Props) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const plugin = useRef(Autoplay({ delay: 5000 }));

    const [activeSlide, setActiveSlide] = useState(0);
    let sliderRef = useRef<Slider | null>(null);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const settings = useMemo(
        () => ({
            infinite: true,
            slidesToShow: 1,
            speed: 1000,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 5000,
            beforeChange: (current: number, next: number) => setActiveSlide(next),
        }),
        [],
    );

    const renderDots = () => {
        let dotElements = [];
        for (let i = 0; i < data.length; i++) {
            dotElements.push(
                <div
                    key={i}
                    className={cn(
                        'h-2.5 w-2.5 cursor-pointer rounded-full border border-primary transition-all duration-300 ease-linear',
                        { 'w-6 bg-primary': i === activeSlide },
                    )}
                    onClick={() => sliderRef.current?.slickGoTo(i)}
                />,
            );
        }
        return dotElements;
    };

    return (
        <div className="slider-container">
            <Slider {...settings} ref={sliderRef}>
                {data.map((movie, index) => (
                    <div key={movie.id}>
                        <div className="flex h-[36rem] gap-x-28 rounded-lg border shadow-lg dark:border-none max-md:flex-col-reverse">
                            <div className="w-1/2 px-10 py-16 max-md:h-2/5 max-md:w-full max-md:p-5">
                                <h1
                                    className={cn(
                                        'mb-20 line-clamp-2 text-3xl font-semibold transition-all duration-300 max-md:mb-2 max-md:line-clamp-1',
                                        {
                                            'opacity-100 delay-1000 animate-in slide-in-from-top':
                                                index === activeSlide,
                                            'translate-y-5 opacity-0 blur-md': index !== activeSlide,
                                        },
                                    )}
                                >
                                    {movie.title}
                                </h1>
                                <div className="mb-10 flex gap-x-10 text-sm text-gray-500 max-md:mb-4">
                                    <div
                                        className={cn('transition-all delay-300 duration-500', {
                                            'opacity-100 delay-1000 animate-in slide-in-from-left':
                                                index === activeSlide,
                                            'translate-y-5 opacity-0 blur-md': index !== activeSlide,
                                        })}
                                    >
                                        <p>RELEASED DATE</p>
                                        <p className="text-base font-semibold italic text-gray-950 dark:text-white">
                                            {format(new Date(movie.releaseDate), 'yyyy')}
                                        </p>
                                    </div>
                                    <div
                                        className={cn('transition-all delay-300 duration-500', {
                                            'opacity-100 delay-1000 animate-in slide-in-from-right':
                                                index === activeSlide,
                                            'translate-y-5 opacity-0 blur-md': index !== activeSlide,
                                        })}
                                    >
                                        <p>DURATION</p>
                                        <p className="text-base font-semibold italic text-gray-950 dark:text-white">
                                            {movie.runtime + ' minutes'}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    className={cn('mb-2 line-clamp-6 delay-300 duration-500 max-md:line-clamp-2', {
                                        'opacity-100 delay-1000 animate-in slide-in-from-bottom': index === activeSlide,
                                        'translate-y-5 opacity-0 blur-md': index !== activeSlide,
                                    })}
                                >
                                    {movie.overview}
                                </p>
                                <Link
                                    href="/detail/1"
                                    className={cn(
                                        'group flex w-fit cursor-pointer items-center gap-x-5 text-primary delay-300 duration-500',
                                        {
                                            'opacity-100 delay-1000 animate-in zoom-in': index === activeSlide,
                                            'translate-y-5 opacity-0 blur-md': index !== activeSlide,
                                        },
                                    )}
                                >
                                    <p className="border-b border-white group-hover:border-primary dark:border-black">
                                        DETAIL
                                    </p>
                                    <MoveRight />
                                </Link>
                            </div>
                            <div className="w-1/2 max-md:h-3/5 max-md:w-full">
                                <Image
                                    src={movie.posterPath}
                                    alt={'poster' + movie.id}
                                    width={500}
                                    height={500}
                                    className="h-full w-full rounded-lg max-md:object-top"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            <div className="my-5 flex justify-center gap-x-2">{renderDots()}</div>
        </div>
    );
}

export default MovieCarousel;
