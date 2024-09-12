'use client';
import { ResponseApiTemplate, SignInFormSchema, SignInInfo } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

type Props = {};

const SignInForm = (props: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const authGoogleCode = searchParams.get('code');
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (authGoogleCode !== null) {
            setGoogleLoading(true);
            setTimeout(() => {
                setGoogleLoading(false);
            }, 5000);
        }
    }, [authGoogleCode]);

    const form = useForm({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            usernameOrEmail: '',
            password: '',
            keepLogin: true,
        },
    });

    const onSubmit = async (values: SignInInfo) => {
        const res = await fetch('http://localhost:3000/api/user/auth', {
            method: 'POST',
            body: JSON.stringify({
                ...values,
            }),
            credentials: 'include',
        });

        const resJson = (await res.json()) as ResponseApiTemplate;
        if (resJson.status >= 400) {
            if ('errors' in resJson) {
                if (resJson.errors?.length !== 0) {
                    resJson.errors?.forEach((error) => {
                        for (const field in error) {
                            if (error.hasOwnProperty(field)) {
                                form.setError(
                                    field as 'usernameOrEmail' | 'password' | 'keepLogin' | 'root' | `root.${string}`,
                                    { message: error[field] },
                                );
                            }
                        }
                    });
                    return;
                }
            }
            form.setError('usernameOrEmail', { message: resJson.message });
        }

        // router.push('/');
    };

    return (
        <Form {...form}>
            <form
                className="flex h-full w-full flex-col rounded-3xl pb-6 text-center"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <h3 className="mb-3 text-4xl font-extrabold">Sign In</h3>
                <p className="text-grey-700 mb-4">Enter your email and password</p>
                <Link
                    href="/"
                    className="text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-grey-300 mb-3 flex w-full items-center justify-center py-4 text-sm font-medium transition duration-300 focus:ring-4"
                >
                    <Image
                        className="mr-2 h-5"
                        src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                        alt=""
                        width={20}
                        height={20}
                    />
                    Sign in with Google {googleLoading && <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />}
                </Link>
                <div className="mb-3 flex items-center">
                    <hr className="border-grey-500 h-0 grow border-b border-solid" />
                    <p className="text-grey-600 mx-4">or</p>
                    <hr className="border-grey-500 h-0 grow border-b border-solid" />
                </div>
                <FormField
                    control={form.control}
                    name="usernameOrEmail"
                    render={({ field }) => (
                        <FormItem className="mb-5 w-full text-left">
                            <FormLabel htmlFor="usernameOrEmail" className="text-grey-900 mb-2 text-start text-sm">
                                Username or Email*{' '}
                            </FormLabel>
                            <div className="flex flex-col">
                                <FormControl>
                                    <Input
                                        id="usernameOrEmail"
                                        type="text"
                                        placeholder="mail@loopple.com"
                                        className="no-focus placeholder:text-grey-700 w-full"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="mt-1 text-sm" />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="mb-5 w-full text-left">
                            <FormLabel htmlFor="password" className="text-grey-900 mb-2 text-start text-sm">
                                Password*
                            </FormLabel>
                            <div className="flex flex-col">
                                <div className="relative">
                                    <FormControl className="">
                                        <>
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter password"
                                                className="no-focus placeholder:text-grey-700 w-full"
                                                {...field}
                                            />
                                            {form.getValues().password !== '' && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {showPassword ? (
                                                        <Eye
                                                            className="size-4 cursor-pointer text-gray-700"
                                                            onClick={() => setShowPassword(false)}
                                                        />
                                                    ) : (
                                                        <EyeOff
                                                            className="size-4 cursor-pointer text-gray-700"
                                                            onClick={() => setShowPassword(true)}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    </FormControl>
                                </div>
                                <FormMessage className="mt-1 text-sm" />
                            </div>
                        </FormItem>
                    )}
                />
                <div className="mb-8 flex flex-row justify-between">
                    <FormField
                        control={form.control}
                        name="keepLogin"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Keep me logged in</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Link href="/" className="text-purple-blue-500 mr-4 text-sm font-medium">
                        Forget password?
                    </Link>
                </div>
                <Button
                    className="mb-5"
                    loading={form.formState.isSubmitting}
                    disabled={form.formState.isSubmitting || googleLoading}
                >
                    Sign In
                </Button>
                <p className="text-grey-900 text-sm leading-relaxed">
                    Not registered yet?{' '}
                    <Link href="/sign-up" className="text-grey-700 font-bold">
                        Create an Account
                    </Link>
                </p>
            </form>
        </Form>
    );
};

export default SignInForm;
