'use client';
import { cn } from '@/lib/utils';
import { MoveRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useRef, useState } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

type Props = {};

const TestPage = (props: Props) => {
    const [activeSlide, setActiveSlide] = useState(0);
    let sliderRef = useRef<Slider | null>(null);

    const settings = useMemo(
        () => ({
            className: 'center',
            centerMode: true,
            infinite: true,
            focusOnSelect: true,
            centerPadding: '100px',
            slidesToShow: 2,
            speed: 500,
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
                    },
                },
            ],
        }),
        [],
    );

    const generateElements = () => {
        let results = [];
        for (let i = 0; i < 10; i++) {
            results.push(
                <div
                    className={cn('scale-90 px-10 transition-all duration-500 ease-linear max-[1300px]:px-4', {
                        'scale-100': i === activeSlide,
                    })}
                    key={i}
                >
                    <Image
                        src="https://i.pinimg.com/originals/57/6e/57/576e572af9e6a307432b3e9b955f5be6.jpg"
                        alt="poster"
                        width={400}
                        height={400}
                        quality={100}
                        className="h-72 w-full"
                    />
                    <div className="py-2">
                        <h2 className="mb-3 line-clamp-2 text-2xl font-bold">
                            Lorem ipsum dolor, sit amet consectetur adipisicing.
                        </h2>
                        <p className="mb-3 line-clamp-3 text-gray-500">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil iure ad veniam amet alias
                            hic magnam aliquam sed consequatur expedita.
                        </p>

                        <Link href="/detail/1" className="flex items-center gap-x-3">
                            <p className="font-bold text-primary">More Details</p>{' '}
                            <MoveRight className="text-primary" />
                        </Link>
                    </div>
                </div>,
            );
        }
        return results;
    };

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

    return (
        <div className="flex px-4 pt-10">
            <div className="flex flex-auto items-center justify-center max-md:hidden">
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
                    {generateElements()}
                </Slider>
                <div className="mt-3 flex gap-x-1 max-md:justify-center">{renderDots()}</div>
            </div>
        </div>
    );
};

export default TestPage;
