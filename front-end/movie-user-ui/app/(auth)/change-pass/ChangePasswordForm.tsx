import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import HeaderMobile from '@/components/ui/header-mobile';
import { Input } from '@/components/ui/input';
import { changePassword } from '@/services/authServices';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'nextjs-toploader/app';
import { toast } from 'sonner';

const FormSchema = z
    .object({
        newPassword: z
            .string()
            .regex(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), {
                message:
                    'Password must contain at least one uppercase letter, one lowercase letter, one special character, one number and at least 8 characters',
            }),
        confirmPassword: z
            .string()
            .regex(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), {
                message:
                    'Password must contain at least one uppercase letter, one lowercase letter, one special character, one number and at least 8 characters',
            }),
    })
    .superRefine(({ newPassword, confirmPassword }, ctx) => {
        if (confirmPassword !== newPassword) {
            ctx.addIssue({
                code: 'custom',
                message: 'The confirm did not match',
                path: ['confirmPassword'],
            });
        }
    });

type Props = {
    className?: string;
    email: string;
};

const ChangePasswordForm = ({ email, className }: Props) => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });
    const router = useRouter();

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const changePasswordApi = async () => {
            if (loading) return;
            const res = await changePassword({ email, newPassword: data.newPassword });
            if (res) {
                if (res.status === 200) {
                    toast.success('Congratulations', {
                        description: res.message,
                    });
                    router.push('/sign-in');
                } else {
                    form.setError('newPassword', { message: res?.message });
                }
            } else {
                form.setError('newPassword', { message: 'Some thing went wrong!' });
            }
            setLoading(false);
        };

        setLoading(true);
        changePasswordApi();
    };

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };
    return (
        <div className={`flex flex-col ${className ? className : ''}`}>
            <HeaderMobile title="Update your password" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mx-auto max-w-lg space-y-6 max-sm:w-full max-sm:px-10"
                >
                    <div>
                        <h2 className="mb-5 text-xl font-medium">Enter your new password to complete!</h2>
                    </div>
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New password</FormLabel>
                                <FormControl>
                                    <Input type={showPassword ? 'text' : 'password'} placeholder="*****" {...field} />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>Please enter your new password.</FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input type={showPassword ? 'text' : 'password'} placeholder="*****" {...field} />
                                </FormControl>
                                <FormMessage />
                                <FormDescription
                                    className="flex cursor-default items-center gap-x-2"
                                    onClick={handleShowPassword}
                                >
                                    Show password{' '}
                                    {showPassword ? (
                                        <Eye className="size-4 cursor-pointer text-gray-700" />
                                    ) : (
                                        <EyeOff className="size-4 cursor-pointer text-gray-700" />
                                    )}
                                </FormDescription>
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

export default ChangePasswordForm;
