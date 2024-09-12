'use client';
import React from 'react';
import { CookiesProvider } from 'react-cookie';

type Props = React.PropsWithChildren<{}>;

const CookiesProviderCus = ({ children }: Props) => {
    return <CookiesProvider>{children}</CookiesProvider>;
};

export default CookiesProviderCus;
