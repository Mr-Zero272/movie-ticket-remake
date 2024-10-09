'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import HeaderMobile from '@/components/ui/header-mobile';
import { Input } from '@/components/ui/input';
import { sendOtpCodeChangePassword } from '@/services/authServices';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
    email: z.string().email({ message: 'This email is not valid!' }),
});

type Props = {
    className?: string;
    onSendOtpCodeChangePassword: (email: string) => void;
};

const SendOtpCodeForm = ({ onSendOtpCodeChangePassword, className }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        if (loading) return;
        setLoading(true);
        const fetchApi = async () => {
            const res = await sendOtpCodeChangePassword(data.email);
            if (res) {
                if (res.status === 200) {
                    onSendOtpCodeChangePassword(data.email);
                } else {
                    form.setError('email', { message: res.message });
                }
            } else {
                form.setError('email', { message: 'Some thing went wrong!' });
            }
            setLoading(false);
        };
        fetchApi();
    };
    return (
        <div className={`flex flex-col ${className ? className : ''}`}>
            <HeaderMobile title="Send otp code" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mx-auto max-w-lg space-y-6 max-sm:w-full max-sm:px-10"
                >
                    <div>
                        <h2 className="mb-5 text-xl font-medium">Enter your email to verify your email!</h2>
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="abc@mail.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Please enter the one-time password sent to your phone.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="mt-3 w-full">
                        <Button type="submit" loading={loading} disabled={loading} className="w-full">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SendOtpCodeForm;
