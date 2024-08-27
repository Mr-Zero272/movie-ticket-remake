import { format } from 'date-fns';
import React from 'react';

type Props = {};

const TicketBase = (props: Props) => {
    return (
        <div className="flex items-center gap-x-5 rounded-md border-l-2 border-l-primary p-5 shadow-lg dark:bg-[#1f1f1f]">
            <div className="w-1/3">
                <h2 className="mb-2 font-bold">Wonder Woman 1984</h2>
                <div>
                    <p className="text-xs text-gray-500">DATE & TIME</p>
                    <p className="font-semibold">{format('2024-08-19T20:00:00', 'dd MMM - HH:mm')}</p>
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-between border-l-2 pl-5">
                <div className="mb-2 flex items-center gap-x-5">
                    <div>
                        <p className="text-xs text-gray-500">ROW</p>
                        <p className="font-semibold">10</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">SEAT</p>
                        <p className="font-semibold">10</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">HALL</p>
                        <p className="font-semibold">H2</p>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-gray-500">CINEMA</p>
                    <p className="font-semibold">Moon Movie</p>
                </div>
            </div>
        </div>
    );
};

export default TicketBase;
