'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { addNewComment, editComment } from '@/services/commentService';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';

import { type ResponseApiTemplate } from '@/types/auth';
import { type Comment } from '@/types/comment';
import { toast } from 'sonner';
import { useRouter } from 'nextjs-toploader/app';

const FormSchema = z.object({
    content: z.string(),
});

interface Props {
    onSuccess?: (c: Comment) => void;
    onSubmit?: () => void;
    onCancel?: () => void;
    movieId: number;
    labelSubmit?: string;
    parentId?: number;
}

interface AddCommentProps extends Props {}

interface EditCommentProps extends Props {
    commentId: number;
    content: string;
}

const CommentForm = (props: AddCommentProps | EditCommentProps) => {
    const { user, isUserSignedIn } = useAuth();
    const router = useRouter();
    let content = '';
    if ('content' in props) {
        content = props.content;
    }
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            content: content,
        },
    });

    const onSubmitForm = async (data: z.infer<typeof FormSchema>) => {
        if (data.content === '') {
            return;
        }

        if (!isUserSignedIn()) {
            toast.info('Sign in is required', {
                description: 'You have to sign to do this action!',
                action: {
                    label: 'Sign in now',
                    onClick: () => router.push('/sign-in'),
                },
            });
            return;
        }

        if (props.onSubmit) props.onSubmit();
        let res: Comment | ResponseApiTemplate | undefined = undefined;
        if ('content' in props) {
            res = await editComment({ commentId: props.commentId, content: data.content });
        } else {
            res = await addNewComment({
                userId: user?.id as string,
                username: user?.username as string,
                userProfileImage: user?.avatar as string,
                content: data.content,
                movieId: props.movieId,
                parentCommentId: props.parentId,
            });
            form.reset();
        }
        if (res && 'id' in res) {
            if ('content' in props) {
                toast.success('Update comment success!', {
                    description: 'Your comment is updated!',
                });
            } else {
                toast.success('Add new comment successfully', {
                    description: 'Thanks for your comment.',
                });
            }

            if (props.onSuccess) {
                props.onSuccess(res);
            }
        } else {
            form.setError('content', { message: 'Some thing went wrong try again later!' });
        }
    };
    return (
        <Form {...form}>
            <form className="mb-6" onSubmit={form.handleSubmit(onSubmitForm)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="flex w-full items-center">
                            <FormLabel htmlFor="comment" className="sr-only">
                                Your comment
                            </FormLabel>
                            <div className="flex flex-1 flex-col">
                                <FormControl>
                                    <Textarea
                                        id="comment"
                                        rows={4}
                                        className="no-focus"
                                        placeholder="Leave a comment..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="mt-1 text-sm" />
                            </div>
                        </FormItem>
                    )}
                />

                <div className="mt-3 flex items-center gap-x-2">
                    <Button type="submit" loading={form.formState.isSubmitting} disabled={form.formState.isSubmitting}>
                        {props.labelSubmit ? props.labelSubmit : 'Save'}
                    </Button>
                    {props.onCancel && (
                        <Button variant="outline" onClick={props.onCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default CommentForm;
