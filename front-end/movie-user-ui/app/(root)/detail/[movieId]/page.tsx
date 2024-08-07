import React from 'react';

type Props = {
    params: { movieId: string };
};

const Page = ({ params }: Props) => {
    return <div>Page {params.movieId}</div>;
};

export default Page;
