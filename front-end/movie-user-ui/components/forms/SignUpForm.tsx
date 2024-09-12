'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const SignUpFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'Username or email must contain at least 3 character(s)' })
        .max(30, { message: 'Username or email must contain at most 30 character(s)' }),
    email: z.string().email(),
    password: z.string().regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/), {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one digit.',
    }),
    keepLogin: z.boolean(),
});

type SignInUpInfo = z.infer<typeof SignUpFormSchema>;

type Props = {};

const SignUpForm = (props: Props) => {
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
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            keepLogin: true,
        },
    });

    const onSubmit = async (values: SignInUpInfo) => {
        console.log(values);
    };

    return (
        <Form {...form}>
            <form
                className="flex h-full w-full flex-col rounded-3xl pb-6 text-center"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <h3 className="mb-3 text-4xl font-extrabold">Sign Up</h3>
                <p className="text-grey-700 mb-4">Enter your base information to sign up with us</p>
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
                    name="username"
                    render={({ field }) => (
                        <FormItem className="mb-5 w-full text-left">
                            <FormLabel htmlFor="username" className="text-grey-900 mb-2 text-start text-sm">
                                Username*{' '}
                            </FormLabel>
                            <div className="flex flex-col">
                                <FormControl>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter username"
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
                    name="email"
                    render={({ field }) => (
                        <FormItem className="mb-5 w-full text-left">
                            <FormLabel htmlFor="email" className="text-grey-900 mb-2 text-start text-sm">
                                Email*{' '}
                            </FormLabel>
                            <div className="flex flex-col">
                                <FormControl>
                                    <Input
                                        id="email"
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
                </div>
                <Button
                    className="mb-5"
                    loading={form.formState.isSubmitting}
                    disabled={form.formState.isSubmitting || googleLoading}
                >
                    Sign Up
                </Button>
                <p className="text-grey-900 text-sm leading-relaxed">
                    Already have an account?{' '}
                    <Link href="/sign-in" className="text-grey-700 font-bold">
                        Sign in
                    </Link>
                </p>
            </form>
        </Form>
    );
};

export default SignUpForm;
