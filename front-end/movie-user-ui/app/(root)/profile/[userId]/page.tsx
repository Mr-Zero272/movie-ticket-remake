import ProfileForm from '@/components/forms/ProfileForm';
import { fetchUser } from '@/services';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type Props = {
    params: { userId: string };
};

const Page = async ({ params }: Props) => {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(params.userId);

    if (!userInfo?.onboarded) redirect('/onboarding');
    return (
        <div>
            <ProfileForm
                title="Your Profile"
                sub="Manage profile information for account security"
                type="update"
                user={userInfo}
            />
            {/* <UserProfile /> */}
        </div>
    );
};

export default Page;
