'use client';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
    title: string;
};

const HeaderMobile = ({ title }: Props) => {
    const router = useRouter();
    return (
        <div className="mb-3 flex items-center gap-x-3">
            <button className="cursor-pointer rounded-lg bg-accent p-1.5 active:scale-90" onClick={() => router.back()}>
                <ChevronLeft className="size-5" />
            </button>
            <p className="font-medium">{title}</p>
        </div>
    );
};

export default HeaderMobile;
