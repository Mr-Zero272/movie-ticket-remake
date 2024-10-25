import { currentUser } from '@/services/authServices';
import { fetchShowing, fetchShowings } from '@/services/movieServices';
import { fetchSeatDetails } from '@/services/seatServices';
import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import BookingForm from './bookingForm';

type Props = {
    params: Promise<{ showingId: number }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    // read route params
    const showingId = (await params).showingId;

    // fetch data
    const showing = await fetchShowing(showingId);

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    const poster = showing.movie.posterPath
        ? showing.movie.posterPath
        : 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg';

    return {
        title: showing.movie.title + ' - Moon Movie',
        description: 'Choose your seats real time here',
        openGraph: {
            images: [poster, ...previousImages],
        },
    };
}

const ShowingPage = async ({ params }: Props) => {
    const showingId = (await params).showingId;
    const userInfo = await currentUser();

    if (userInfo === undefined) {
        throw new Error('Error form user server!');
    }

    if (!userInfo?.onboarded) redirect('/onboarding');

    const showingInfo = await fetchShowing(showingId);
    const listSeat = await fetchSeatDetails(showingId);
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

export default ShowingPage;
