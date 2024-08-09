'use client';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image } from '@/lib/utils';
import { User, UserValidation } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Image from 'next/image';
import * as z from 'zod';
import { addUser, updateClerkUserImage, updateClerkUserInfo, updateUser } from '@/services';
import { useUser } from '@clerk/nextjs';

type UserInfo = {
    username: string;
    name: string;
    bio: string;
    avatar: string;
};

type Props = {
    user: User;
    title: string;
    sub: string;
    type: 'create' | 'update';
};

export const UserSchema = z.object({
    username: z.string().min(3).max(30),
    name: z.string().min(3).max(30),
    bio: z.string().min(3).max(1000),
    avatar: z.string().url(),
});

function ProfileForm({ user, title, sub, type }: Props) {
    const userObject = useUser();

    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing('media');
    const inputImageRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(UserSchema),
        defaultValues: {
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
            console.log(files[0].name);
            const imgRes = await startUpload(files);
            // await updateClerkUserImage(files[0], user.userClerkId);
            await userObject.user?.setProfileImage({ file: files[0] });
            if (imgRes && imgRes[0].url) {
                values.avatar = imgRes[0].url;
            }
        }

        if (type === 'create') {
            await addUser({
                id: '',
                userClerkId: user.userClerkId,
                username: values.username,
                name: values.name,
                bio: values.bio,
                avatar: values.avatar,
                onboarded: true,
                createdAt: '',
                modifiedAt: '',
                role: 'USER',
            });
            if (values.username !== user.username || values.name !== user.name) {
                await updateClerkUserInfo(values.username, values.name, '', user.userClerkId);
            }
        } else {
            await setTimeout(() => {
                console.log(123);
            }, 1000);
        }

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
                    <div className="md:w-3/5 md:border-r md:pr-10">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="my-7 flex w-full items-center">
                                    <FormLabel className="w-1/4 text-right text-gray-400">Name: </FormLabel>
                                    <div className="flex w-3/4 flex-col">
                                        <FormControl>
                                            <Input type="text" className="no-focus ml-7" {...field} />
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
                                <FormItem className="my-7 flex w-full items-center">
                                    <FormLabel className="w-1/4 text-right text-gray-400">Username: </FormLabel>
                                    <div className="flex w-3/4 flex-col">
                                        <FormControl>
                                            <Input type="text" className="no-focus ml-7" {...field} />
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
                                <FormItem className="my-7 flex w-full items-center">
                                    <FormLabel className="w-1/4 text-right text-gray-400">Bio: </FormLabel>
                                    <div className="flex w-3/4 flex-col">
                                        <FormControl>
                                            <Textarea rows={8} className="no-focus ml-7" {...field} />
                                        </FormControl>
                                        <FormMessage className="mt-1 text-sm" />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="my-7 flex w-full text-gray-400">
                            <div className="w-1/4 text-right"></div>

                            <div className="ml-7 w-3/4">
                                <Button type="submit" loading={form.formState.isSubmitting}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center pb-5 md:w-2/5">
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
