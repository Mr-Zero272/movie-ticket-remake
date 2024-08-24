import InfiniteScrollSchedule from '@/components/shared/InfiniteScrollSchedule';
import { fetchScheduleShowings } from '@/services/movieServices';
import { fetchUser } from '@/services/userServices';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type Props = {};

async function Page({}: Props) {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    return (
        <section className="p-2 text-gray-600">
            <InfiniteScrollSchedule />
        </section>
    );
}

export default Page;
