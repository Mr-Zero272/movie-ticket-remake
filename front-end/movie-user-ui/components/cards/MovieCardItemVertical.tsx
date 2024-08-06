import { format } from 'date-fns';
import { Ellipsis, Heart, Play, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {};

const MovieCardItemVertical = (props: Props) => {
    return (
        <figure className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
            <div className="group relative cursor-pointer">
                <Image
                    src="https://i.pinimg.com/originals/7b/56/a4/7b56a49b35f83813563c5b4ea48b3b72.jpg"
                    alt="movie 1 image"
                    width={500}
                    height={500}
                    className="h-72 w-full object-cover"
                    quality={100}
                />
                <div className="absolute right-0 top-0 hidden h-72 w-full items-center justify-center bg-gray-700 bg-opacity-35 group-hover:flex">
                    <Link href="/booking" className="flex size-12 items-center justify-center rounded-full bg-white">
                        <Play className="size-6 fill-black" />
                    </Link>
                </div>
            </div>
            <div className="px-3 py-5 text-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold">Mission: Impossible - Fallout</h3>
                    <Heart className="size-5 cursor-pointer text-red-500" />
                </div>
                <div className="mb-3 flex items-center gap-x-3 text-xs text-gray-400">
                    <span>147 MIN</span>
                    <span className="h-3 w-[0.1rem] rounded-full bg-gray-400 dark:bg-white"></span>
                    <span>ADVENTURE</span>
                </div>
                <div>
                    <Ellipsis className="text-gray-400" />
                </div>
            </div>
        </figure>
    );
};

export default MovieCardItemVertical;
