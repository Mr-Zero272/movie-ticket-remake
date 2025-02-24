'use client';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

function Error() {
    const route = useRouter();
    const pathname = usePathname();

    return (
        <div className="mx-auto grid h-screen place-items-center px-8 text-center">
            <div>
                <Flag className="mx-auto h-20 w-20" />
                <h1 color="blue-gray" className="mt-10 text-3xl leading-snug md:text-4xl">
                    Error 500
                    <br /> It looks like something went wrong.
                </h1>
                <p className="mx-auto mb-14 mt-8 text-[18px] font-normal text-gray-500 md:max-w-sm">
                    Don&apos;t worry, our team is already on it. <br />
                    Please try refreshing the page or come back later.
                </p>
                <Button color="gray" className="w-full px-4 md:w-[8rem]" onClick={() => route.prefetch(pathname)}>
                    Refresh
                </Button>
            </div>
        </div>
    );
}

export default Error;
