'use client';
import { format } from 'date-fns';
import { EllipsisVertical, Loader2, MessageSquareText, Send } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'nextjs-toploader/app';
import { Fragment, useEffect, useState } from 'react';

import { useAuth } from '@/components/auth/AuthProvider';
import CommentForm from '@/components/forms/CommentForm';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuItem as DropdownItemCustom } from '@/components/ui/dropdown-menu-custom';
import { cn } from '@/lib/utils';
import { deleteComment, fetchRepliesForComment } from '@/services/commentService';

import { type Comment } from '@/types/comment';
import { toast } from 'sonner';

type Props = {
    loading?: boolean;
    level?: number;
    movieId: number;
    commentInfo: Comment;
    replies?: Comment[];
    showReply?: boolean;
};

const Comment = ({
    loading = false,
    level = 1,
    movieId,
    commentInfo: commentInformation,
    replies: rps,
    showReply = false,
}: Props) => {
    const { user } = useAuth();
    const [isFetchingReplies, setIsFetchingReplies] = useState(false);
    const [commentInfo, setCommentInfo] = useState(commentInformation);
    const [isEditing, setIsEditing] = useState(false);
    const [isShowReply, setIsShowReply] = useState(showReply);
    const [isShowAddReplyForm, setIsShowAddReplyForm] = useState(false);
    const [replies, setReplies] = useState<Comment[]>(() => {
        if (rps) {
            return rps;
        }
        return [];
    });
    const [isDeleted, setIsDeleted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (rps) {
            setReplies(rps);
        }
    }, [rps]);

    const handleShowingReplies = () => {
        if (level === 2) {
            router.push(`/comment/${movieId}/${commentInfo.id}`);
            return;
        }
        setIsShowReply((prev) => !prev);
        const fetchReplies = async () => {
            const res = await fetchRepliesForComment(commentInfo.id);

            setReplies(res);
            setIsFetchingReplies(false);
        };

        if (!isShowReply) {
            setIsFetchingReplies(true);
            fetchReplies();
        }
    };

    const handleUpdateSuccess = (c: Comment) => {
        setCommentInfo(c);
    };

    const handleCancelAddReply = () => {
        setIsShowAddReplyForm(false);
    };

    const handleAddReply = () => {
        if (level === 2) {
            router.push(`/comment/${movieId}/${commentInfo.id}`);
            return;
        }

        setIsShowAddReplyForm((prev) => !prev);
    };

    const handleDeleteComment = () => {
        const deleteCommentCallApi = async () => {
            const res = await deleteComment(commentInfo.id);
            if (res) {
                if ('content' in res) {
                    setIsDeleted(true);
                    toast.success('Delete comment successfully!', {
                        description: 'Your comment is deleted!',
                    });
                } else {
                    toast.error('Cannot delete this comment!', {
                        description: 'Some thing went wrong!',
                    });
                }
            } else {
                toast.error('Cannot delete this comment!', {
                    description: 'Some thing went wrong!',
                });
            }
        };

        deleteCommentCallApi();
    };

    const handleAddReplySuccess = (reply: Comment) => {
        setIsShowAddReplyForm(false);
        setReplies((prev) => [reply, ...prev]);
        setIsShowReply(true);
    };

    if (loading) {
        return (
            <article className="animate-pulse rounded-lg">
                <footer className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                        <p className="mr-3 flex items-center">
                            <div className="me-2 size-6 rounded-full bg-gray-200"></div>
                            <div className="mb-2 h-3.5 w-32 rounded-full bg-gray-200"></div>
                        </p>
                        <div className="mb-2 h-3.5 w-24 rounded-full bg-gray-200"></div>
                    </div>
                </footer>
                <div>
                    <div className="flex gap-x-2">
                        <div className="mb-2 h-3 w-80 rounded-full bg-gray-200"></div>
                        <div className="mb-2 h-3 w-24 rounded-full bg-gray-200"></div>
                        <div className="mb-2 h-3 w-64 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="flex gap-x-2">
                        <div className="mb-2 h-3 w-64 rounded-full bg-gray-200"></div>
                        <div className="mb-2 h-3 w-72 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="flex gap-x-2">
                        <div className="mb-2 h-3 w-32 rounded-full bg-gray-200"></div>
                        <div className="mb-2 h-3 w-24 rounded-full bg-gray-200"></div>
                    </div>
                </div>
                <div className="mt-4 flex items-center space-x-4">
                    <div className="mb-2 h-3.5 w-24 rounded-full bg-gray-200"></div>
                </div>
            </article>
        );
    }

    if (isDeleted) {
        return null;
    }

    return (
        <Fragment>
            <article
                className={cn('mb-7 border-b pb-5 text-base', {
                    'pl-4 lg:pl-10': level == 2,
                })}
            >
                <footer className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                        <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                            <Image
                                className="mr-2 size-6 rounded-full border object-cover"
                                src={commentInfo.userProfileImage}
                                alt={commentInfo.username}
                                width={24}
                                height={24}
                            />
                            {commentInfo.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format(commentInfo.modifiedAt, 'MMM. d, yyyy')}
                        </p>
                    </div>
                    {!isEditing && user?.id === commentInfo.userId && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="inline-flex items-center rounded-lg bg-white p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                    type="button"
                                >
                                    <EllipsisVertical className="size-4" />
                                    <span className="sr-only">Comment settings</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="dark:border-none" align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                        <button>
                                            <span>Edit</span>
                                        </button>
                                    </DropdownMenuItem>
                                    <DropdownItemCustom isFocused={false}>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <span>Remove</span>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Delete this comment</DialogTitle>
                                                    <DialogDescription>
                                                        You will not be able to undo this action.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <DialogFooter className="sm:justify-start">
                                                    <DialogClose asChild onClick={handleDeleteComment}>
                                                        <Button type="button">Delete</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="secondary">
                                                            Close
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </DropdownItemCustom>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </footer>
                {!isEditing && (
                    <div className="rounded-lg bg-accent p-4 dark:bg-[#333334]">
                        <p className="text-gray-500 dark:text-gray-400">{commentInfo.content}</p>
                        <div className="mt-4 flex items-center space-x-4">
                            <button
                                type="button"
                                className="flex items-center text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
                                onClick={handleShowingReplies}
                            >
                                <MessageSquareText className="me-1 size-3.5" />
                                {isShowReply ? 'Hide reply' : 'Show reply'}{' '}
                                {isFetchingReplies && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
                            </button>
                            <button
                                type="button"
                                className="flex items-center text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
                                onClick={handleAddReply}
                            >
                                <Send className="me-1 size-3.5" />
                                Reply
                            </button>
                        </div>
                    </div>
                )}
                {isEditing && (
                    <CommentForm
                        movieId={movieId}
                        commentId={commentInfo.id}
                        content={commentInfo.content}
                        onSubmit={() => setIsEditing(false)}
                        onSuccess={handleUpdateSuccess}
                        onCancel={() => setIsEditing(false)}
                    />
                )}
            </article>
            {isShowAddReplyForm && (
                <CommentForm
                    movieId={movieId}
                    labelSubmit="Post reply"
                    parentId={commentInfo.id}
                    onCancel={handleCancelAddReply}
                    onSuccess={handleAddReplySuccess}
                />
            )}
            {isShowReply &&
                replies.length !== 0 &&
                replies.map((reply) => <Comment key={reply.id} commentInfo={reply} movieId={movieId} level={2} />)}
        </Fragment>
    );
};

export default Comment;
