import { currentUser } from '@/services/authServices';
import { User } from '@/types/auth';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {};

const TestPage = async (props: Props) => {
    const userInfo = (await currentUser()) as User;

    if (userInfo === undefined) {
        throw new Error('Error form user server!');
    }

    if (!userInfo?.onboarded) redirect('/onboarding');
    return (
        <div>
            <div>Test-page</div>
            {/* <div>{userInfo?.id + '-' + userInfo.email + '-' + userInfo.username}</div> */}
        </div>
    );
};

export default TestPage;
