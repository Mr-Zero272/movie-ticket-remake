'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { isBase64Image } from '@/lib/utils';
import { updateUser } from '@/services/authServices';
import { addImageFiles } from '@/services/mediaServices';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

import { User } from '@/types/auth';

type UserInfo = {
    username: string;
    email: string;
    name: string;
    bio: string;
    avatar: string;
};

type Props = {
    user: User;
    title: string;
    sub: string;
};

export const UserSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    name: z.string().refine((val) => val === '' || (val.length >= 3 && val.length <= 30), {
        message: 'Username must be empty or between 3 and 30 characters',
    }),
    bio: z.string(),
    avatar: z.string().url(),
});

function ProfileForm({ user, title, sub }: Props) {
    const { updateUser: updateUserInContext } = useAuth();

    const [files, setFiles] = useState<File[]>([]);
    const inputImageRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            email: user.email || '',
            username: user.username || '',
            name: user.name || '',
            bio: user.bio || '',
            avatar: user.avatar || '',
        },
    });

    const handleImage = (e: ChangeEvent<HTMLInputElement>, filedChange: (value: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            setFiles(Array.from(e.target.files));

            if (!file.type.includes('image')) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || '';

                filedChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: UserInfo) => {
        const blob = values.avatar;
        const hasImageChanged = isBase64Image(blob);

        if (hasImageChanged) {
            const imgRes = await addImageFiles(files);

            if (imgRes && imgRes[0]) {
                values.avatar = imgRes[0];
            }
        }

        const res = await updateUser({ ...values });
        if (res && 'username' in res) {
            updateUserInContext(res);
        }

        if (res && 'status' in res && res.status >= 400) {
            if (res.errors && 'errors' in res && Object.keys(res.errors).length !== 0) {
                for (const field in res.errors) {
                    form.setError(field as 'username' | 'email' | 'name' | 'bio' | 'root' | `root.${string}`, {
                        message: res.errors[field as keyof typeof res.errors],
                    });
                }
                return;
            }
            return;
        }

        toast.success('Update profile', { description: 'Your profile has been updated successfully.' });

        if (!pathname.includes('/profile')) {
            router.push('/');
        }
    };

    return (
        <div className="px-4 py-5">
            <div className="mb-5">
                <h2 className="text-4xl">{title}</h2>
                <p className="text-gray-500">{sub}</p>
            </div>
            <Form {...form}>
                <form className="flex flex-col-reverse md:flex-row" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="p-5 md:flex-1 md:border-r md:pr-10">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="my-4 flex max-w-full items-center gap-x-5">
                                    <FormLabel className="w-1/5 text-right text-gray-400">Email*:</FormLabel>
                                    <div className="flex flex-1 flex-col">
                                        <FormControl>
                                            <Input type="email" className="no-focus" {...field} />
                                        </FormControl>
                                        <FormMessage className="mt-1 text-sm" />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="my-4 flex w-full items-center gap-x-5">
                                    <FormLabel className="w-1/5 text-right text-gray-400">Name: </FormLabel>
                                    <div className="flex flex-1 flex-col">
                                        <FormControl>
                                            <Input type="text" className="no-focus" {...field} />
                                        </FormControl>
                                        <FormMessage className="mt-1 text-sm" />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="my-4 flex w-full items-center gap-x-5">
                                    <FormLabel className="w-1/5 text-right text-gray-400">Username*: </FormLabel>
                                    <div className="flex flex-1 flex-col">
                                        <FormControl>
                                            <Input type="text" className="no-focus" {...field} />
                                        </FormControl>
                                        <FormMessage className="mt-1 text-sm" />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="my-4 flex w-full items-center gap-x-5">
                                    <FormLabel className="w-1/5 text-right text-gray-400">Bio: </FormLabel>
                                    <div className="flex flex-1 flex-col">
                                        <FormControl>
                                            <Textarea rows={8} className="no-focus" {...field} />
                                        </FormControl>
                                        <FormMessage className="mt-1 text-sm" />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="my-7 flex w-full text-gray-400">
                            <div className="w-1/4 text-right"></div>

                            <div className="ml-7 w-3/4">
                                <Button
                                    type="submit"
                                    loading={form.formState.isSubmitting}
                                    disabled={form.formState.isSubmitting}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-col items-center justify-center pb-5 md:mt-0 md:w-2/5">
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center">
                                    <FormLabel
                                        htmlFor="avatar"
                                        className="mb-3 flex flex-col items-center justify-center"
                                    >
                                        {field.value ? (
                                            <Image
                                                src={field.value}
                                                alt="avatar"
                                                width={96}
                                                height={96}
                                                priority
                                                className="mb-3 size-24 rounded-full object-cover"
                                            />
                                        ) : (
                                            <Image
                                                src="/assets/profile.svg"
                                                alt="avatar"
                                                width={24}
                                                height={24}
                                                className="mb-3 object-contain"
                                            />
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (inputImageRef.current) {
                                                    inputImageRef.current.click();
                                                }
                                            }}
                                        >
                                            Choose file
                                        </Button>
                                    </FormLabel>
                                    <FormControl className="text-base-semibold flex-1 text-gray-200">
                                        <Input
                                            id="avatar"
                                            ref={inputImageRef}
                                            type="file"
                                            accept="image/*"
                                            placeholder="Upload a photo"
                                            className="hidden"
                                            onChange={(e) => handleImage(e, field.onChange)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="text-left text-gray-400">
                            <p>Maximum file size 1 MB</p>
                            <p>Format: .JPEG, .JPG, .PNG</p>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default ProfileForm;
