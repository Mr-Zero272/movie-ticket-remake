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
import { User } from '@/types/user';
import { userInfo } from 'os';
import { fetchShowing, fetchShowings } from '@/services/movieServices';

type Props = {
    userInfo: User;
    showingInfo: Showing;
    listSeat: SeatDetail[];
    listShowTimes: ShowingDto[];
};

const BookingForm = ({ userInfo, showingInfo, listSeat, listShowTimes }: Props) => {
    const [listSelectedSeats, setListSelectedSeats] = useState<string[]>([]);
    const [activeStep, setActiveStep] = useState(stepperShowing[0]);
    const [showingData, setShowingData] = useState<Showing | null>(showingInfo);
    const [showTimes, setShowTimes] = useState(listShowTimes);
    const [loading, setLoading] = useState(false);

    const handleChooseStep = (step: Step) => {
        setActiveStep(step);
    };

    const handleChooseSeat = (seatId: string) => {
        setListSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((s) => s !== seatId);
            } else {
                return [seatId, ...prev];
            }
        });
    };

    const handleChangeShowing = useCallback(
        (showingId: number) => {
            if (showingData) {
                if (showingId === showingData.id) {
                    return;
                }

                const fetchShowingApi = async () => {
                    const res = await fetchShowing(showingId);
                    setShowingData(res);
                };

                fetchShowingApi();
            }
        },
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
                } else {
                    const showTimes = await fetchShowings(date, showingInfo.movie.id);

                    setShowTimes(showTimes);
                    const showingRes = await fetchShowing(showTimes[0].id);
                    setShowingData(showingRes);
                }

                setLoading(false);
            };

            fetchShowingsApi();
        },
        [showingData, showingInfo],
    );
    return (
        <div>
            <article>
                <Stepper value={activeStep.value} data={stepperShowing} onChooseStep={handleChooseStep} />
                <div className="mt-5 hidden max-[1200px]:block">
                    <MovieCardItemHorizontal />
                </div>
                <div className="flex justify-between">
                    <div className="w-3/4 max-[1200px]:w-full">
                        {activeStep.step === 1 && (
                            <Step1
                                userId={userInfo.id}
                                showingId={showingData ? showingData.id : null}
                                showingDate={showingData ? showingData.startTime : null}
                                listSelectedSeats={listSelectedSeats}
                                seatData={listSeat}
                                listShowTimes={showTimes}
                                loading={loading}
                                onChooseSeat={handleChooseSeat}
                                onChangeShowing={handleChangeShowing}
                                onChangeDate={handleChangeDate}
                                onNextStep={() => setActiveStep(stepperShowing[1])}
                            />
                        )}
                        {activeStep.step === 2 && <Step2 onBackStep={() => setActiveStep(stepperShowing[0])} />}
                    </div>
                    <div className="flex w-1/4 justify-center max-[1200px]:hidden">
                        <MovieCardItemVertical
                            userId={userInfo.userClerkId}
                            movieId={showingInfo.movie.id}
                            poster={showingInfo.movie.posterPath}
                            title={showingInfo.movie.title}
                            runtime={showingInfo.movie.runtime}
                            firstGenre={showingInfo.movie.genres[0].name}
                            love={showingInfo.movie.userFavoriteMovies.some((s) => s.userId === userInfo.userClerkId)}
                        />
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BookingForm;
