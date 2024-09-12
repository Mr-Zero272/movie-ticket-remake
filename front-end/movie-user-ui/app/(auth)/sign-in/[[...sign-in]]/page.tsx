import SignInForm from '@/components/forms/SignInForm';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
    return (
        <div className="mx-auto flex w-full flex-col rounded-lg">
            <div className="draggable mx-auto flex h-full justify-center md:gap-5 lg:justify-normal xl:gap-14">
                <div className="flex items-center justify-center">
                    <div className="flex w-96 items-center max-sm:px-3">
                        <SignInForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
