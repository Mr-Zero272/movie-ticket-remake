import { currentUser } from '@clerk/nextjs/server';
import BookingForm from './bookingForm';
import { fetchUser } from '@/services/userServices';
import { redirect } from 'next/navigation';
import { fetchShowing, fetchShowings } from '@/services/movieServices';
import { fetchSeatDetails } from '@/services/seatServices';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booking your tickets',
    description: 'Booking your ticket with realtime choosing seat',
};

type Props = {
    params: { showingId: number };
};

const Showing = async ({ params }: Props) => {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

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
