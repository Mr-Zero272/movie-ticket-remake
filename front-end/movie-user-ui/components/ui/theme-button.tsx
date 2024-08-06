'use client';

import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Switch } from './switch';

type Props = {
    className?: string;
    isSwitch?: boolean;
};

function ThemeButton({ className, isSwitch = false }: Props) {
    const { theme, setTheme } = useTheme();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const handleToggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    if (!hydrated) {
        return null;
    }

    if (isSwitch) {
        return <Switch checked={theme === 'dark'} onClick={handleToggleTheme} />;
    }

    return (
        <button className={cn('', { [className as string]: className })} onClick={handleToggleTheme}>
            {theme && theme === 'light' ? (
                <Moon className="inline-block size-6" />
            ) : (
                <Sun className="inline-block size-6" />
            )}
        </button>
    );
}

export default ThemeButton;
