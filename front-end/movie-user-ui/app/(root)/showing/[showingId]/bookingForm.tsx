'use client';
import MovieCardItemHorizontal from '@/components/cards/MovieCardItemHorizontal';
import Stepper from '@/components/shared/Stepper';
import { stepperShowing } from '@/constants';
import { Step } from '@/types/stepper';
import React, { useCallback, useState } from 'react';
import Step2 from './step-2';
import Step1 from './step-1';
import MovieCardItemVertical from '@/components/cards/MovieCardItemVertical';
import { Showing, ShowingDto } from '@/types/showing';
import { SeatDetail } from '@/types/seat';
import { fetchShowing, fetchShowings } from '@/services/movieServices';
import { useToast } from '@/components/ui/use-toast';
import { seatService } from '@/services';
import { User } from '@/types/auth';

type Props = {
    userInfo: User;
    showingInfo: Showing;
    listSeat: SeatDetail[];
    listShowTimes: ShowingDto[];
};

const BookingForm = ({ userInfo, showingInfo, listSeat, listShowTimes }: Props) => {
    const { toast } = useToast();
    const [listSelectedSeats, setListSelectedSeats] = useState<SeatDetail[]>([]);
    const [activeStep, setActiveStep] = useState(stepperShowing[0]);
    const [showingData, setShowingData] = useState<Showing | null>(showingInfo);
    const [showTimes, setShowTimes] = useState(listShowTimes);
    const [amount, setAmount] = useState(() => {
        const sum = listSeat.reduce((accumulator, currentValue) => {
            if (currentValue.userId === userInfo.id && currentValue.status === 'choosing') {
                return accumulator + currentValue.price;
            }
            return accumulator;
        }, 0);
        return sum;
    });
    const [loading, setLoading] = useState(false);

    const handleChooseStep = (step: Step) => {
        if (step.step === 2 && amount === 0) {
            toast({
                title: 'Error!',
                description: 'You need to choose at least 1 seat to continue!',
            });
            return;
        }
        setActiveStep(step);
    };

    const handleChooseSeat = useCallback((s: SeatDetail, amount: number) => {
        setListSelectedSeats((prev) => {
            if (prev.some((so) => so.id === s.id)) {
                return prev.filter((so) => so.id !== s.id);
            } else {
                return [s, ...prev];
            }
        });
        setAmount(amount);
    }, []);

    const handleChangeShowing = useCallback(
        async (showingId: number) => {
            if (showingData) {
                if (showingId === showingData.id) {
                    return;
                }
                await seatService.refreshSeatState(showingData.id, userInfo.id);
                setAmount(0);
                const fetchShowingApi = async () => {
                    const res = await fetchShowing(showingId);
                    setShowingData(res);
                };

                fetchShowingApi();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [showingData],
    );

    const handleChangeDate = useCallback(
        (date: string) => {
            const fetchShowingsApi = async () => {
                setLoading(true);
                if (showingData) {
                    const showTimes = await fetchShowings(date, showingData.movie.id);

                    setShowTimes(showTimes);

                    if (showTimes && showTimes.length !== 0) {
                        const showingRes = await fetchShowing(showTimes[0].id);
                        setShowingData(showingRes);
                    } else {
                        setShowingData(null);
                    }
                    await seatService.refreshSeatState(showingData.id, userInfo.id);
                    setAmount(0);
                } else {
                    const showTimes = await fetchShowings(date, showingInfo.movie.id);

                    setShowTimes(showTimes);
                    const showingRes = await fetchShowing(showTimes[0].id);
                    // await seatService.refreshSeatState(showingRes.id, userInfo.id);
                    setShowingData(showingRes);
                }

                setLoading(false);
            };

            fetchShowingsApi();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [showingData, showingInfo],
    );
    return (
        <div>
            <article>
                <Stepper value={activeStep.value} data={stepperShowing} onChooseStep={handleChooseStep} />
                <div className="mt-5 hidden max-[1200px]:block">
                    <MovieCardItemHorizontal
                        userId={userInfo.id}
                        movieId={showingInfo.movie.id}
                        poster={showingInfo.movie.posterPath}
                        title={showingInfo.movie.title}
                        runtime={showingInfo.movie.runtime}
                        firstGenre={showingInfo.movie.genres[0].name}
                        love={showingInfo.movie.userFavoriteMovies.some((s) => s.userId === userInfo.id)}
                    />
                </div>
                <div className="flex justify-between">
                    <div className="w-3/4 max-[1200px]:w-full">
                        {activeStep.step === 1 && (
                            <Step1
                                userId={userInfo.id}
                                amount={amount}
                                showingId={showingData ? showingData.id : null}
                                showingDate={showingData ? showingData.startTime : null}
                                seatData={listSeat}
                                listShowTimes={showTimes}
                                loading={loading}
                                onChooseSeat={handleChooseSeat}
                                onChangeShowing={handleChangeShowing}
                                onChangeDate={handleChangeDate}
                                onNextStep={() => {
                                    if (amount === 0) {
                                        toast({
                                            title: 'Error!',
                                            description: 'You need to choose at least 1 seat to continue!',
                                        });
                                        return;
                                    }
                                    setActiveStep(stepperShowing[1]);
                                }}
                            />
                        )}
                        {activeStep.step === 2 && (
                            <Step2
                                userId={userInfo.id}
                                userName={userInfo.username}
                                dateTime={showingData?.startTime || ''}
                                showingId={showingData?.id || 0}
                                seats={listSelectedSeats}
                                hallName={
                                    listSelectedSeats.length !== 0 ? listSelectedSeats[0].seat.auditorium.name : ''
                                }
                                hallAddress={
                                    listSelectedSeats.length !== 0 ? listSelectedSeats[0].seat.auditorium.address : ''
                                }
                                amount={amount}
                                onBackStep={() => setActiveStep(stepperShowing[0])}
                            />
                        )}
                    </div>
                    <div className="flex w-1/4 justify-center max-[1200px]:hidden">
                        <MovieCardItemVertical
                            className="w-56"
                            userId={userInfo.id}
                            movieId={showingInfo.movie.id}
                            poster={showingInfo.movie.posterPath}
                            title={showingInfo.movie.title}
                            runtime={showingInfo.movie.runtime}
                            firstGenre={showingInfo.movie.genres[0].name}
                            love={showingInfo.movie.userFavoriteMovies.some((s) => s.userId === userInfo.id)}
                        />
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BookingForm;
