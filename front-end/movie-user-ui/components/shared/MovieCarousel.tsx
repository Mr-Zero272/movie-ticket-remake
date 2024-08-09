'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { EmblaPluginType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

const colors = [
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-blue-500',
    'bg-green-500',
];

const carouselTestData = [
    {
        id: '1',
        title: 'Star Wars',
        releaseDate: '2024-05-01',
        runtime: 112,
        overview:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam quisquam omnis cum. Recusandae ea modi ullam labore dignissimos sint nisi?',
    },
    {
        id: '2',
        title: 'The king',
        releaseDate: '2018-05-01',
        runtime: 652,
        overview:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam quisquam omnis cum. Recusandae ea modi ullam labore dignissimos sint nisi?',
    },
    {
        id: '3',
        title: 'Saw you on the night',
        releaseDate: '2022-05-01',
        runtime: 152,
        overview:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam quisquam omnis cum. Recusandae ea modi ullam labore dignissimos sint nisi?',
    },
    {
        id: '4',
        title: 'Please love your self more',
        releaseDate: '2023-05-01',
        runtime: 102,
        overview:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam quisquam omnis cum. Recusandae ea modi ullam labore dignissimos sint nisi?',
    },
    {
        id: '5',
        title: "I've been reading books of old",
        releaseDate: '2023-05-01',
        runtime: 102,
        overview:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam quisquam omnis cum. Recusandae ea modi ullam labore dignissimos sint nisi?',
    },
];

type Props = {};

function MovieCarousel({}: Props) {
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

    const renderDots = (dots: number = 5) => {
        let dotElements = [];
        for (let i = 0; i < dots; i++) {
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
                    {carouselTestData.map((item, index) => (
                        <CarouselItem key={item.id}>
                            <div
                                className={cn(
                                    'grid w-full grid-cols-3 items-center gap-x-5 rounded-xl px-16 shadow-md max-md:grid-cols-1 max-md:grid-rows-2 max-md:px-0',
                                    {
                                        [colors[index]]: colors[index],
                                    },
                                )}
                            >
                                <div className="col-span-1 text-white max-md:order-last max-md:p-6">
                                    <h2 className="text-3xl font-bold dark:text-gray-900">{item.title}</h2>
                                    <div className="mb-5 flex items-center gap-x-3 font-semibold dark:text-gray-900">
                                        <span>{format(new Date(item.releaseDate), 'yyyy')}</span>
                                        <span className="h-4 w-0.5 bg-white dark:bg-gray-900"></span>
                                        <span>{item.runtime} minutes</span>
                                    </div>
                                    <p className="mb-3 line-clamp-3 text-sm dark:text-gray-900">{item.overview}</p>
                                    <Link href={`/detail/${item.id}`}>
                                        <Button className="dark:text-gray-900">
                                            <Play className="mr-2 h-4 w-4" /> More detail
                                        </Button>
                                    </Link>
                                </div>
                                <Image
                                    src="https://i.pinimg.com/originals/3c/7c/86/3c7c86deebf7abfacad188fb67285c63.png"
                                    alt="backdrop"
                                    width={400}
                                    height={400}
                                    className="col-span-2 h-72 w-full skew-x-[20deg] object-cover max-md:skew-x-0 max-md:rounded-t-md"
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
