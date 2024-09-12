import { cn } from '@/lib/utils';
import { Ticket } from '@/types/ticket';
import { format } from 'date-fns';
import { Armchair, MonitorPlay, TableRowsSplit } from 'lucide-react';

interface Props extends Ticket {
    active?: boolean;
    onClick?: () => void;
}

const TicketBase = ({ active, onClick }: Props) => {
    return (
        <div
            className={cn('relative rounded-xl bg-accent p-5 dark:bg-[#262626]', {
                'bg-[#262626] dark:bg-white': active,
            })}
            onClick={onClick}
        >
            <div className="flex gap-x-5">
                <div className="space-y-4">
                    <p className="mb-3 text-sm text-gray-500">Time</p>
                    <p
                        className={cn('text-3xl font-semibold', {
                            'text-white dark:text-black': active,
                        })}
                    >
                        {format('2024-08-19T20:00:00', 'h:mm a')}
                    </p>

                    <p className="text-sm text-gray-500">
                        {'Date: ' + format('2024-08-19T20:00:00', 'EEE - dd MMM, yyyy')}
                    </p>
                </div>
                <div className="flex flex-1 items-center justify-end gap-x-4 max-sm:flex-col max-sm:items-end max-sm:gap-x-0 max-sm:gap-y-2">
                    <div
                        className={cn(
                            'flex flex-col items-center justify-center rounded-lg bg-black p-3 text-sm text-white dark:bg-white dark:text-black max-sm:flex-row max-sm:gap-x-2 max-sm:py-0.5',
                            {
                                'bg-white text-black dark:bg-black dark:text-white': active,
                            },
                        )}
                    >
                        <Armchair className="h-10 w-7" />
                        <p className="font-bold">Seat</p>
                        <p>10</p>
                    </div>
                    <div
                        className={cn(
                            'flex flex-col items-center justify-center rounded-lg bg-black p-3 text-sm text-white dark:bg-white dark:text-black max-sm:flex-row max-sm:gap-x-2 max-sm:py-0.5',
                            {
                                'bg-white text-black dark:bg-black dark:text-white': active,
                            },
                        )}
                    >
                        <TableRowsSplit className="h-10 w-7" />
                        <p className="font-bold">Row</p>
                        <p>A</p>
                    </div>
                    <div
                        className={cn(
                            'flex flex-col items-center justify-center rounded-lg bg-black p-3 text-sm text-white dark:bg-white dark:text-black max-sm:flex-row max-sm:gap-x-2 max-sm:py-0.5',
                            {
                                'bg-white text-black dark:bg-black dark:text-white': active,
                            },
                        )}
                    >
                        <MonitorPlay className="h-10 w-7" />
                        <p className="font-bold">Hall</p>
                        <p>Alpha</p>
                    </div>
                </div>
            </div>
            <div className="my-5 border-b-2 border-dashed pt-5">
                <div className="absolute -left-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                <div className="absolute -right-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
            </div>
            <div className={cn('flex justify-between gap-x-5 font-bold', { 'text-white dark:text-black': active })}>
                <p>Movie:</p>
                <p className="line-clamp-1">The Lord of the Rings: The Rings of Power</p>
            </div>
        </div>
    );
};

export default TicketBase;
