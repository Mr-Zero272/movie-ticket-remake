'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

function BackBtn() {
    const router = useRouter();
    return (
        <div className="flex items-center" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
            <Button variant="link" className="text-gray-500">
                Back
            </Button>
        </div>
    );
}

export default BackBtn;
