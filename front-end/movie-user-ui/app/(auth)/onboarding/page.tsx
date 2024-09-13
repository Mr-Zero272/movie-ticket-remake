import ProfileForm from '@/components/forms/ProfileForm';
import { currentUser } from '@/services/authServices';
import { User } from '@/types/auth';

async function Page() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    return (
        <main className="mx-auto flex w-3/4 flex-col justify-start px-10 py-10 max-xl:w-full max-lg:px-3">
            <section className="p-10">
                <ProfileForm title="On Boarding" sub="Complete your profile now to use Moon Movie" user={user} />
            </section>
        </main>
    );
}

export default Page;
