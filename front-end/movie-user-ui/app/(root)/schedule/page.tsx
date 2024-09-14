import InfiniteScrollSchedule from '@/components/shared/InfiniteScrollSchedule';
import { currentUser } from '@/services/authServices';
import { redirect } from 'next/navigation';

type Props = {};

async function Page({}: Props) {
    const userInfo = await currentUser();

    if (userInfo === undefined) {
        throw new Error('Error form user server!');
    }

    if (!userInfo?.onboarded) redirect('/onboarding');

    return (
        <section className="p-2 text-gray-600">
            <InfiniteScrollSchedule />
        </section>
    );
}

export default Page;
