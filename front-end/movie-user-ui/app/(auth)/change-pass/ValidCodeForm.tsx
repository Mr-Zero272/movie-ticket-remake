import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import HeaderMobile from '@/components/ui/header-mobile';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { sendOtpCodeChangePassword, validCode } from '@/services/authServices';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
    code: z.string().min(5, {
        message: 'Your code must be 6 number.',
    }),
});

type Props = {
    className?: string;
    email: string;
    onValidCode: () => void;
};

const ValidCodeForm = ({ className, email, onValidCode }: Props) => {
    const [loading, setLoading] = useState(false);
    const [reSendLoading, setReSendLoading] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            code: '',
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const validCodeApi = async () => {
            if (loading) return;
            const res = await validCode({ email: email, code: data.code });
            if (res) {
                if (res.status === 200) {
                    onValidCode();
                } else {
                    form.setError('code', { message: res?.message });
                }
            } else {
                form.setError('code', { message: 'Some thing went wrong!' });
            }
            setLoading(false);
        };
        setLoading(true);
        validCodeApi();
    };

    const resendCode = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (reSendLoading) return;
        setReSendLoading(true);
        const fetchApi = async () => {
            const res = await sendOtpCodeChangePassword(email);
            if (res && res.status !== 200) {
                form.setError('code', { message: 'Some thing went wrong!' });
            }
            setReSendLoading(false);
        };
        fetchApi();
    };
    return (
        <div className={`flex flex-col ${className ? className : ''}`}>
            <HeaderMobile title="Valid otp code" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mx-auto max-w-lg space-y-6 max-sm:w-full max-sm:px-10"
                >
                    <div>
                        <h2 className="mb-5 text-xl font-medium">
                            Please enter the one-time opt code sent to your email.
                        </h2>
                    </div>
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription className="flex items-center">
                                    <p>Didn&apos;t receive the opt code?</p>
                                    <Button variant="link" onClick={resendCode}>
                                        Send again
                                    </Button>
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

export default ValidCodeForm;
