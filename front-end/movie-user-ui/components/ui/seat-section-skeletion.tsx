import React from 'react';

type Props = {};

const SeatSectionSkeleton = (props: Props) => {
    const renderSeatSkeleton = (num: number) => {
        let seats = [];
        for (let i = 0; i < num; i++) {
            seats.push(<div key={i} className="size-4 animate-pulse cursor-pointer rounded-sm border bg-slate-500" />);
        }
        return seats;
    };
    return (
        <>
            <div className="mb-7 flex animate-pulse flex-col items-center justify-center">
                <div className="h-1 w-56 animate-pulse rounded-full bg-gray-400 shadow-lg"></div>
                <p className="text-primary">SCREEN</p>
            </div>
            <div className="flex flex-col items-center gap-0.5">
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(8)}</div>
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(10)}</div>
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(12)}</div>
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(12)}</div>
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(14)}</div>
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(14)}</div>
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(14)}</div>
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(14)}</div>
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(12)}</div>
                <div className="flex justify-center gap-0.5">{renderSeatSkeleton(10)}</div>
            </div>
        </>
    );
};

export default SeatSectionSkeleton;
