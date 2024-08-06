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

type UserInfo = {
    username: string;
    name: string;
    bio: string;
    avatar: string;
};

type Props = {
    user: User;
};

function ProfileForm({ user }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing('media');
    const inputImageRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(UserValidation),
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
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].url) {
                values.avatar = imgRes[0].url;
            }
        }

        await setTimeout(() => {
            console.log(123);
        }, 1000);

        // await updateUser({
        //     userId: user.id,
        //     username: values.username,
        //     name: values.name,
        //     bio: values.bio,
        //     image: values.profile_photo,
        //     path: pathname,
        // });

        if (pathname === '/profile/edit') {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="px-4 py-5">
            <div className="mb-5">
                <h2 className="text-4xl">Your Profile</h2>
                <p className="text-gray-500">Manage profile information for account security</p>
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
                                    <FormControl>
                                        <Input type="text" className="no-focus ml-7 w-3/4" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="my-7 flex w-full items-center">
                                    <FormLabel className="w-1/4 text-right text-gray-400">Username: </FormLabel>
                                    <FormControl>
                                        <Input type="text" className="no-focus ml-7 w-3/4" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="my-7 flex w-full items-center">
                                    <FormLabel className="w-1/4 text-right text-gray-400">Bio: </FormLabel>
                                    <FormControl>
                                        <Textarea rows={8} className="no-focus ml-7 w-3/4" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="my-7 flex w-full text-gray-400">
                            <div className="w-1/4 text-right"></div>

                            <div className="ml-7 w-3/4">
                                <Button type="submit">Save</Button>
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
                                            onClick={() => {
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
