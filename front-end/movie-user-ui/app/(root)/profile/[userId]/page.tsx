import { useState } from 'react';
import { dropdownMenuProfileData } from '@/constants';
import Image from 'next/image';
import { DropdownMenu } from '@/components/ui/dropdown-menu-custom-2';
import { SquarePen } from 'lucide-react';
import ProfileForm from '@/components/forms/ProfileForm';
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser } from '@/services';
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
            <ProfileForm user={userInfo} />
        </div>
    );
};

export default Page;
