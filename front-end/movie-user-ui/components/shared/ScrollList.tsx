import Link from 'next/link';
import React from 'react';

type Props = React.PropsWithChildren<{
    title: string;
}>;

function ScrollList({ title, children }: Props) {
    return (
        <div className="w-full">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-3xl font-bold">{title}</h3>
                <Link href="/search" className="text-sm uppercase text-primary">
                    See all
                </Link>
            </div>
            <div>{children}</div>
        </div>
    );
}

export default ScrollList;
