import { currentUser } from '@/services/authServices';
import { fetchShowing, fetchShowings } from '@/services/movieServices';
import { fetchSeatDetails } from '@/services/seatServices';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import BookingForm from './bookingForm';

export const metadata: Metadata = {
    title: 'Booking your tickets',
    description: 'Booking your ticket with realtime choosing seat',
};

type Props = {
    params: { showingId: number };
};

const Showing = async ({ params }: Props) => {
    const userInfo = await currentUser();

    if (userInfo === undefined) {
        throw new Error('Error form user server!');
    }

    if (!userInfo?.onboarded) redirect('/onboarding');

    const showingInfo = await fetchShowing(params.showingId);
    const listSeat = await fetchSeatDetails(params.showingId);
    const listShowTimes = await fetchShowings(showingInfo.startTime, showingInfo.movie.id);

    return (
        <div className="p-4">
            <BookingForm
                userInfo={userInfo}
                showingInfo={showingInfo}
                listSeat={listSeat}
                listShowTimes={listShowTimes}
            />
        </div>
    );
};

export default Showing;
