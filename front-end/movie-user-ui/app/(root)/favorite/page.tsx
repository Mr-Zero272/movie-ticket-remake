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
import { fetchPopularMovies } from '@/services/movieServices';
import { fetchListFavoriteMovies } from '@/services/favoriteServices';
import FavoriteMain from './favorite-main';

type Props = {};

const FavoritePage = async (props: Props) => {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    const popularMovies = await fetchPopularMovies({ page: 3, size: 4, sort: 'releaseDate', genreId: 0 });
    const favoriteMovies = await fetchListFavoriteMovies(userInfo.userClerkId);

    return (
        <section>
            <FavoriteMain
                username={userInfo.username}
                userId={userInfo.userClerkId}
                listFavoriteMovies={favoriteMovies}
                listPopularMovies={popularMovies.data}
            />
        </section>
    );
};

export default FavoritePage;
