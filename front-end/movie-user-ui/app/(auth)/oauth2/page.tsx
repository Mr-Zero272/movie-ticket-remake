'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

type Props = {};

const Oauth2Page = (props: Props) => {
    const searchParams = useSearchParams();
    console.log(searchParams.get('code'));
    return <div>Oauth2Page</div>;
};

export default Oauth2Page;
