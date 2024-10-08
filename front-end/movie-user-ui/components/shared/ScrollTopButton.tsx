'use client';
import { ChevronUp, SquareArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {};

const ScrollTopButton = (props: Props) => {
    const [visible, setVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const toggleVisible = () => {
            const scrolled = document.documentElement.scrollTop;

            if (scrolled > 450) {
                setVisible(true);
            } else if (scrolled <= 450) {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisible);

        return () => {
            window.removeEventListener('scroll', toggleVisible);
        };
    });
    return (
        <div
            className={`fixed bottom-7 right-7 z-50 cursor-pointer rounded-lg bg-accent p-2 opacity-90 shadow-md transition-all duration-200 ease-linear hover:opacity-100 active:scale-90 max-md:bottom-20 ${visible ? 'scale-100' : 'scale-0'}`}
            onClick={scrollToTop}
        >
            <ChevronUp className="size-6 dark:text-white" />
        </div>
    );
};

export default ScrollTopButton;
