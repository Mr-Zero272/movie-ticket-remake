'use client';
import CommentForm from '@/components/forms/CommentForm';
import React, { useState } from 'react';
import Comment from '../../detail/[movieId]/comment';
import { type Comment as CommentType } from '@/types/comment';
import { useRouter } from 'next/navigation';

type Props = {
    movieId: number;
    commentInfo: CommentType;
    replies: Array<CommentType>;
};

const AddReply = ({ movieId, commentInfo: commentInformation, replies: rps }: Props) => {
    const [commentInfo, setCommentInfo] = useState<Comment>(commentInformation);
    const [replies, setRelies] = useState<Array<Comment>>(rps);
    const router = useRouter();

    const handleSuccess = (c: Comment) => {
        setRelies((prev) => [c, ...prev]);
    };
    return (
        <div className="md:p-7">
            <div>
                <h3 className="text-xl font-medium">Add reply</h3>
                <CommentForm
                    movieId={movieId}
                    labelSubmit="Post reply"
                    parentId={commentInfo.id}
                    onSuccess={handleSuccess}
                    onCancel={() => router.back()}
                />
            </div>
            <Comment movieId={movieId} commentInfo={commentInfo} replies={replies} showReply />
        </div>
    );
};

export default AddReply;
