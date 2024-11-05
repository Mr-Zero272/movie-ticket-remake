import { fetchCommentById, fetchRepliesForComment } from '@/services/commentService';
import { Fragment } from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AddReply from './add-reply';

type Props = {
    params: Promise<{ slugs: number[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const [, commentId] = (await params).slugs;

    return {
        title: 'Detail comment ' + commentId + ' - Moon Movie',
        description: 'More information about the movie',
    };
}

const CommentPage = async ({ params }: Props) => {
    const [movieId, commentId] = (await params).slugs;

    const commentInfo = await fetchCommentById(commentId);
    if (!commentInfo) {
        redirect('/not-found');
    }

    const replies = await fetchRepliesForComment(commentInfo.id);

    return (
        <Fragment>
            <AddReply movieId={movieId} commentInfo={commentInfo} replies={replies} />
        </Fragment>
    );
};

export default CommentPage;
