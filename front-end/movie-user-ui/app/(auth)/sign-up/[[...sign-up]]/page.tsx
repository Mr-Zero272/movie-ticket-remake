import SignUpForm from '@/components/forms/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign up - Moon Movie',
    description: 'Sign up to explore our website with more features',
};

export default function Page() {
    return (
        <div className="mx-auto flex w-full flex-col rounded-lg">
            <div className="draggable mx-auto flex h-full justify-center md:gap-5 lg:justify-normal xl:gap-14">
                <div className="flex items-center justify-center">
                    <div className="flex w-96 items-center max-sm:px-3">
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
