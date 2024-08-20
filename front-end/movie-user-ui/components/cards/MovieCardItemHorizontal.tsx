import { format } from 'date-fns';
import { Ellipsis, Heart, Play, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
    className?: string;
};

const MovieCardItemHorizontal = ({ className }: Props) => {
    return (
        <figure className={`flex w-full gap-x-5 ${className as string}`}>
            <div className="group relative cursor-pointer">
                <Image
                    src="https://i.pinimg.com/originals/7b/56/a4/7b56a49b35f83813563c5b4ea48b3b72.jpg"
                    alt="movie 1 image"
                    width={500}
                    height={500}
                    className="size-14 rounded-md object-cover"
                    quality={100}
                />
            </div>
            <div className="text-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold">Mission: Impossible - Fallout</h3>
                </div>
                <div className="mb-3 flex items-center gap-x-3 text-xs text-gray-400">
                    <span>147 MIN</span>
                    <span className="h-3 w-[0.1rem] rounded-full bg-gray-400 dark:bg-white"></span>
                    <span>ADVENTURE</span>
                </div>
            </div>
        </figure>
    );
};

export default MovieCardItemHorizontal;
