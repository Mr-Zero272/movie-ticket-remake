'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { formatCurrencyVND } from '@/lib/utils';
import { Input } from '../ui/input';

const FormSchema = z.object({
    email: z
        .string({ message: 'This email is used to send you ticket information!' })
        .email({ message: 'This email is not valid!' }),
    type: z.enum(['zalopay', 'vnpay'], {
        required_error: 'You need to select a payment method.',
    }),
});

type PropsWithBackBtn = {
    backBtn: boolean;
    onBack: () => void;
};

type Props = {};

const PaymentForm = (props: Props | PropsWithBackBtn) => {
    let haveBackBtn = false;
    let backFun: () => void;
    if ('backBtn' in props) {
        haveBackBtn = true;
        backFun = props.onBack;
    }
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        alert(data.type);
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="flex w-full items-center">
                            <FormLabel className="text-right text-gray-400">Email: </FormLabel>
                            <div className="flex flex-1 flex-col">
                                <FormControl>
                                    <Input type="text" className="no-focus ml-7" {...field} />
                                </FormControl>
                                <FormMessage className="ml-7 mt-1 text-sm" />
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex cursor-pointer items-center justify-between">
                                        <FormLabel className="flex cursor-pointer gap-x-3">
                                            <Image src="/assets/vnpay-logo.svg" alt="vnpay" height={34} width={34} />
                                            <div className="text-sm">
                                                <p>VNPay</p>
                                                <p className="text-gray-500">{formatCurrencyVND(100000)}</p>
                                            </div>
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroupItem value="vnpay" />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem className="flex cursor-pointer items-center justify-between">
                                        <FormLabel className="flex cursor-pointer gap-x-3">
                                            <Image
                                                src="/assets/zalopay-logo.svg"
                                                alt="zalopay"
                                                height={34}
                                                width={34}
                                            />
                                            <div className="text-sm">
                                                <p>Zalopay</p>
                                                <p className="text-gray-500">{formatCurrencyVND(100000)}</p>
                                            </div>
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroupItem value="zalopay" />
                                        </FormControl>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-x-5">
                    <Button type="submit">Submit</Button>
                    {haveBackBtn && (
                        <Button
                            variant="outline"
                            className="border-primary text-primary hover:text-primary dark:bg-transparent"
                            onClick={(e) => {
                                e.preventDefault();
                                backFun();
                            }}
                        >
                            Back
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default PaymentForm;
