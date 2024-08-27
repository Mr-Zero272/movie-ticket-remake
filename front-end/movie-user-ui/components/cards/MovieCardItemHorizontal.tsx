import { Heart } from 'lucide-react';
import Image from 'next/image';

type Props = {
    className?: string;
};

const MovieCardItemHorizontal = ({ className }: Props) => {
    return (
        <figure className={`flex w-full gap-x-5 ${className as string}`}>
            <div className="group relative flex-none cursor-pointer">
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
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="line-clamp-1 font-bold">Mission: Impossible - Fallout</h3>
                </div>
                <div className="flex gap-x-5">
                    <div className="mb-3 flex items-center gap-x-3 text-xs text-gray-400">
                        <span>147 MIN</span>
                        <span className="h-3 w-[0.1rem] rounded-full bg-gray-400 dark:bg-white"></span>
                        <span>ADVENTURE</span>
                    </div>
                    <Heart className="size-4 cursor-pointer text-gray-500" />
                </div>
            </div>
        </figure>
    );
};

export default MovieCardItemHorizontal;
