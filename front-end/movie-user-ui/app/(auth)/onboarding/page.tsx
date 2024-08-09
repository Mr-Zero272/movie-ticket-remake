import { currentUser } from '@clerk/nextjs/server';
import { type User } from '@/types/user';
import ProfileForm from '@/components/forms/ProfileForm';

async function Page() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const userInfo: User = {
        id: '',
        userClerkId: user.id || '',
        username: user.username || '',
        name: user.fullName || '',
        bio: '',
        avatar: user.imageUrl || '',
        onboarded: false,
        createdAt: '',
        modifiedAt: '',
        role: 'USER',
    };

    return (
        <main className="mx-auto flex w-3/4 flex-col justify-start px-10 py-10 max-xl:w-full max-lg:px-3">
            <section className="p-10">
                <ProfileForm
                    title="On Boarding"
                    sub="Complete your profile now to use Moon Movie"
                    user={userInfo}
                    type="create"
                />
            </section>
        </main>
    );
}

export default Page;
