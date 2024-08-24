'use client';

import { cn } from '@/lib/utils';
import { Movie } from '@/types/movie';
import { format } from 'date-fns';
import Autoplay from 'embla-carousel-autoplay';
import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '../ui/carousel';

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

    const renderDots = () => {
        let dotElements = [];
        for (let i = 0; i < count; i++) {
            dotElements.push(
                <div
                    key={i}
                    className={cn(
                        'h-2.5 w-2.5 cursor-pointer rounded-full border border-primary transition-all duration-300 ease-linear',
                        { 'w-6 bg-primary': i + 1 === current },
                    )}
                    onClick={() => api?.scrollTo(i)}
                />,
            );
        }
        return dotElements;
    };

    return (
        <div className="">
            <Carousel
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                setApi={setApi}
            >
                <CarouselContent>
                    {data.map((movie, index) => (
                        <CarouselItem key={movie.id}>
                            <div
                                className={cn(
                                    'grid w-full grid-cols-3 items-center gap-x-5 rounded-xl pl-16 shadow-md max-md:grid-cols-1 max-md:grid-rows-2 max-md:px-0',
                                    {
                                        [colors[index]]: colors[index],
                                    },
                                )}
                            >
                                <div className="col-span-1 text-white max-md:order-last max-md:p-6">
                                    <h2 className="line-clamp-2 text-3xl font-bold dark:text-gray-900">
                                        {movie.title}
                                    </h2>
                                    <div className="mb-5 flex items-center gap-x-3 font-semibold dark:text-gray-900">
                                        <span>{format(new Date(movie.releaseDate), 'yyyy')}</span>
                                        <span className="h-4 w-0.5 bg-white dark:bg-gray-900"></span>
                                        <span>{movie.runtime} minutes</span>
                                    </div>
                                    <p className="mb-3 line-clamp-3 text-sm dark:text-gray-900">{movie.overview}</p>
                                    <Link href={`/detail/${movie.id}`}>
                                        <Button className="dark:text-gray-900">
                                            <Play className="mr-2 h-4 w-4" /> More detail
                                        </Button>
                                    </Link>
                                </div>
                                <Image
                                    src={movie.backdropPath}
                                    alt="backdrop"
                                    width={400}
                                    height={400}
                                    quality={100}
                                    className="col-span-2 h-72 w-full rounded-r-xl object-cover max-md:skew-x-0 max-md:rounded-r-none max-md:rounded-t-md"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="my-5 flex justify-center gap-x-2">{renderDots()}</div>
        </div>
    );
}

export default MovieCarousel;
