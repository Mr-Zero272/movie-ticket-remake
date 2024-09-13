import ProfileForm from '@/components/forms/ProfileForm';
import { currentUser } from '@/services/authServices';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    if (!user?.onboarded) redirect('/onboarding');
    return (
        <div className="w-full">
            <ProfileForm title="Your Profile" sub="Manage profile information for account security" user={user} />
        </div>
    );
};

export default ProfilePage;
