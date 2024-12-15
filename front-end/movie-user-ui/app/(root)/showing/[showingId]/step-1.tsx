import { Button } from '@/components/ui/button';
import DatePickerCustom from '@/components/ui/date-picker-custom';
import { cn } from '@/lib/utils';
import { Flag, Frown, Info } from 'lucide-react';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { Seat, SeatChooseRes, SeatDetail } from '@/types/seat';
import { ShowingDto } from '@/types/showing';
import { fetchSeatDetails } from '@/services/seatServices';
import { format } from 'date-fns';
import SeatSectionSkeleton from '@/components/ui/seat-section-skeletion';
import { Skeleton } from '@/components/ui/skeleton';
import { seatService } from '@/services';

type Props = {
    userId: string;
    amount: number;
    showingId: number | null;
    showingDate: string | null;
    seatData: SeatDetail[];
    listShowTimes: ShowingDto[];
    loading: boolean;
    onNextStep: () => void;
    onChooseSeat: (s: SeatDetail, amount: number) => void;
    onChangeShowing: (showingId: number) => void;
    onChangeDate: (date: string) => void;
    onListSeatsChange: (s: SeatChooseRes) => void;
};

const Step1 = ({
    userId,
    amount,
    showingId,
    showingDate,
    seatData: seats,
    listShowTimes,
    loading = false,
    onChooseSeat,
    onNextStep,
    onChangeDate,
    onChangeShowing,
    onListSeatsChange,
}: Props) => {
    const [seatData, setSeatData] = useState(seats);
    const [myStompClient, setMyStompClient] = useState<null | CompatClient>(null);
    const [seatLoading, setSeatLoading] = useState(false);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (showingId === null) {
            setSeatData([]);
            return;
        }

        const fetchSeats = async () => {
            setSeatLoading(true);
            const res = await fetchSeatDetails(showingId);
            setSeatData(res);
            setSeatLoading(false);
        };

        fetchSeats();
    }, [showingId]);

    useEffect(() => {
        const refreshSState = async () => {
            if (showingId) {
                await seatService.refreshSeatState(showingId, userId);
            }
        };
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            refreshSState();

            event.preventDefault();
            // event.returnValue = '';
            // alert('Confirm refresh');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup the event listener when the component is unmounted
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [showingId, userId]);

    useEffect(() => {
        const sock = new SockJS('http://localhost:8085/ws');
        const stompClient = Stomp.over(sock);
        stompClient.connect({}, (frame: any) => {
            setMyStompClient(stompClient);
            // console.log('Connected: ' + frame);
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (myStompClient !== null) {
            myStompClient.subscribe('/topic/seat-state', (message) => {
                // console.log(listSeats);
                // console.log(message.body);
                // console.log('call sub 1 lan');
                const seatInfo = JSON.parse(message.body) as SeatChooseRes;
                onListSeatsChange(seatInfo);
                setSeatData((prevListSeats) => {
                    let listSeatUpdated = prevListSeats.map((seat) => {
                        if (seat.id === seatInfo.id) {
                            return {
                                ...seat,
                                status: seatInfo.status,
                                userId: seatInfo.userId,
                            };
                        } else {
                            return seat;
                        }
                    });

                    return listSeatUpdated;
                });
            });
        }
    }, [seatData, myStompClient, onListSeatsChange]);

    const handleChooseSeat = useCallback(
        (s: SeatDetail) => {
            if (s.status === 'choosing' && s.userId !== userId) return;
            if (s.status === 'booked') return;
            // console.log(!listSeatSelected.some((seat) => seat.id === seatId && seatStatus === 'choosing'));
            if (!seatData.some((seat) => seat.id === s.id) && s.status === 'choosing') {
                return;
            }
            if (myStompClient !== null) {
                myStompClient.publish({
                    destination: '/app/choosing-seat-ws',
                    body: JSON.stringify({ id: s.id, status: s.status, userId: userId }),
                });
                if (s.status === 'choosing') {
                    onChooseSeat(s, amount - s.price);
                } else {
                    onChooseSeat(s, amount + s.price);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [myStompClient, seatData, amount],
    );

    return (
        <section className="mt-5">
            <div className="mb-3 max-[1200px]:hidden">
                <h1 className="text-2xl font-bold">Mission: Impossible - Fallout</h1>
                <p>
                    Director: <span className="text-gray-500">Leon</span>
                </p>
            </div>
            <div className="mb-5 flex gap-x-5 max-md:flex-col">
                <DatePickerCustom
                    className="w-full md:w-1/2"
                    initialDate={
                        showingDate
                            ? showingDate.split('T')[0] + 'T00:00:00'
                            : new Date().toISOString().split('T')[0] + 'T00:00:00'
                    }
                    onChooseDate={onChangeDate}
                />
                <div className="w-full md:w-1/2">
                    <div className="mb-3 flex w-full items-center justify-between">
                        <h4 className="font-semibold">Show time</h4>
                        <div className="flex">
                            <button className="rounded-full p-1.5 hover:bg-accent">
                                <Info />
                            </button>
                        </div>
                    </div>
                    <div className="no-scrollbar mb-3 flex overflow-auto rounded-lg">
                        {!loading ? (
                            listShowTimes.length === 0 ? (
                                <div className="cursor-not-allowed select-none rounded-lg border border-primary p-2 text-center text-sm">
                                    <div className="mb-2 flex w-20 justify-center truncate rounded-lg px-2 py-1 text-gray-500">
                                        <Frown className="size-5" />
                                    </div>
                                    <div className={cn('w-20 truncate font-semibold')}>Empty</div>
                                </div>
                            ) : (
                                listShowTimes.map((showtime) => {
                                    const active = showtime.id === showingId;
                                    return (
                                        <div
                                            key={showtime.id}
                                            className={cn(
                                                'cursor-pointer select-none rounded-lg p-2 text-center text-sm',
                                                {
                                                    'border border-primary': active,
                                                },
                                            )}
                                            onClick={() => onChangeShowing(showtime.id)}
                                        >
                                            <div
                                                className={cn('mb-2 w-20 truncate rounded-lg px-2 py-1 text-gray-500', {
                                                    'bg-primary text-white': active,
                                                })}
                                            >
                                                {showtime.type}
                                            </div>
                                            <div className={cn('w-20 truncate font-semibold')}>
                                                {format(showtime.startTime, 'HH:mm aa')}
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        ) : (
                            <Fragment>
                                <div className="flex cursor-progress select-none flex-col items-center gap-y-3 rounded-lg border border-primary p-2 text-center text-sm">
                                    <div>
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                    <div>
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </div>
                                <div className="flex cursor-progress select-none flex-col items-center gap-y-3 rounded-lg border border-primary p-2 text-center text-sm">
                                    <div>
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                    <div>
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </div>
                                <div className="flex cursor-progress select-none flex-col items-center gap-y-3 rounded-lg border border-primary p-2 text-center text-sm">
                                    <div>
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                    <div>
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </div>
                            </Fragment>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-evenly max-md:flex-col">
                <div className="w-2/3 max-md:w-full">
                    {seatLoading && <SeatSectionSkeleton />}
                    {!seatLoading && seatData?.length !== 0 && (
                        <Fragment>
                            <div className="mb-7 flex flex-col items-center justify-center">
                                <div className="h-1 w-56 rounded-full bg-gray-400 shadow-lg"></div>
                                <p className="text-primary">SCREEN</p>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(0, 8).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(8, 18).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(18, 30).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(30, 42).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(42, 56).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(56, 70).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(70, 84).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(84, 98).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(98, 110).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                    {seatData.slice(110, 120).map((s) => {
                                        const booked = s.status === 'booked';
                                        let active = false;
                                        let choosing = false;

                                        if (!booked) {
                                            active = s.status === 'choosing' && s.userId === userId;
                                            if (!active) {
                                                choosing = s.status === 'choosing';
                                            }
                                        }

                                        return (
                                            <div
                                                key={s.id}
                                                className={cn('size-4 cursor-pointer rounded-sm border', {
                                                    'reserved-seat': booked,
                                                    'others-seat': choosing,
                                                    'available-seat': !active,
                                                    'your-seat cursor-pointer': active,
                                                })}
                                                onClick={() => handleChooseSeat(s)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </Fragment>
                    )}
                    {!seatLoading && seatData?.length === 0 && (
                        <div className="mx-auto grid place-items-center px-8 text-center">
                            <div>
                                <Flag className="mx-auto size-10" />
                                <h1 color="blue-gray" className="mt-5 text-xl leading-snug md:text-2xl">
                                    Error 400 <br />
                                    <br /> It looks like there was no showing.
                                </h1>
                                <p className="mx-auto mb-5 mt-8 text-[18px] font-normal text-gray-500 md:max-w-sm">
                                    Please try another date.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex w-1/3 flex-col justify-between max-md:w-full">
                    <div className="mb-5">
                        <h3 className="mb-3 font-semibold text-gray-500">Note</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-x-2">
                                <div className="available-seat size-4 rounded-sm border"></div>
                                <p>Available</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <div className="reserved-seat size-4 rounded-sm border"></div>
                                <p>Reserved</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <div className="others-seat size-4 rounded-sm border"></div>
                                <p>Others seat(s)</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <div className="your-seat size-4 rounded-sm border"></div>
                                <p>Your seat(s)</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button onClick={onNextStep}>Next</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step1;
