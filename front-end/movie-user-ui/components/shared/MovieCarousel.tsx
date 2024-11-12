'use client';

import { cn } from '@/lib/utils';
import { Movie } from '@/types/movie';
import { MoveRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

type Props = {
    data: Movie[];
};

function MovieCarousel({ data }: Props) {
    const [activeSlide, setActiveSlide] = useState(0);
    let sliderRef = useRef<Slider | null>(null);

    const settings = useMemo(
        () => ({
            className: 'center',
            autoplay: true,
            centerMode: true,
            infinite: true,
            focusOnSelect: true,
            centerPadding: '100px',
            slidesToShow: 2,
            speed: 2000,
            autoplaySpeed: 5000,
            arrows: false,
            beforeChange: (current: number, next: number) => setActiveSlide(next),
            responsive: [
                {
                    breakpoint: 1350,
                    settings: {
                        centerPadding: '60px',
                    },
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 1,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                    },
                },
                {
                    breakpoint: 660,
                    settings: {
                        slidesToShow: 1,
                        centerPadding: '20px',
                    },
                },
            ],
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
        <div className="mb-5 flex px-4 pt-10">
            <div className="flex w-1/3 items-center justify-center max-md:hidden">
                <h1 className="text-7xl font-extrabold tracking-wide max-[1300px]:-rotate-90">Cinema</h1>
            </div>
            <div
                className="w-2/3 flex-none max-md:w-full"
                // style={{
                //     maskImage:
                //         'linear-gradient(to right,transparent 0,transparent 10px,#000 50px,#000 50%,transparent 50%,transparent 100%),linear-gradient(to left,transparent 0,transparent 10px,#000 50px,#000 50%,transparent 50%,transparent 100%)',
                // }}
            >
                <Slider {...settings} ref={sliderRef}>
                    {data.map((movie, index) => (
                        <div
                            className={cn('scale-90 px-10 transition-all duration-500 ease-linear max-[1300px]:px-4', {
                                'scale-100': index === activeSlide,
                            })}
                            key={movie.id}
                        >
                            <Image
                                src={movie.posterPath}
                                alt="poster"
                                width={400}
                                height={400}
                                quality={100}
                                className={cn('h-72 w-full rounded-lg transition-all duration-500 ease-linear', {
                                    'rounded-none': index === activeSlide,
                                })}
                            />
                            <div
                                className={cn('py-2 opacity-0 transition-all duration-500 ease-linear', {
                                    'opacity-100': index === activeSlide,
                                })}
                            >
                                <h2 className="mb-3 line-clamp-2 text-2xl font-bold">{movie.title}</h2>
                                <p className="mb-3 line-clamp-3 text-justify text-gray-500">{movie.overview}</p>

                                <Link href={`/detail/${movie.id}`} className="flex items-center gap-x-3">
                                    <p className="font-bold text-primary">More Details</p>{' '}
                                    <MoveRight className="text-primary" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </Slider>
                <div className="mt-3 flex gap-x-1 max-md:justify-center">{renderDots()}</div>
            </div>
        </div>
    );
}

export default MovieCarousel;
