import InfiniteScrollSchedule from '@/components/shared/InfiniteScrollSchedule';
import { currentUser } from '@/services/authServices';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Schedule - Moon Movie',
    description: 'Schedule of movies every day',
};

const SchedulePage = async () => {
    const userInfo = await currentUser();

    let userId = '@';

    if (userInfo !== undefined) {
        userId = userInfo.id;
        if (!userInfo?.onboarded) redirect('/onboarding');
    }

    return (
        <section className="p-2 text-gray-600">
            <InfiniteScrollSchedule />
        </section>
    );
};

export default SchedulePage;
