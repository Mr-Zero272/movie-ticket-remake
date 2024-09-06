import ProfileForm from '@/components/forms/ProfileForm';
import { fetchUser } from '@/services/userServices';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');
    return (
        <div>
            {/* profile page */}
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

export default ProfilePage;
