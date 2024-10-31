import ProfileForm from '@/components/forms/ProfileForm';
import { currentUser } from '@/services/authServices';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
    // fetch data
    const user = await currentUser();

    return {
        title: user?.username + ' - Moon Movie',
        description: 'Update your profile information',
    };
}

const ProfilePage = async () => {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    if (!user?.onboarded) redirect('/onboarding');
    return (
        <div className="w-full">
            <ProfileForm title="Your Profile" sub="Manage profile information for account security" user={user} />
        </div>
    );
};

export default ProfilePage;
