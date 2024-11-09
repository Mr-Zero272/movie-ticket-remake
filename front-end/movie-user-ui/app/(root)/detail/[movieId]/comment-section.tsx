'use client';
import CommentForm from '@/components/forms/CommentForm';
import Comment from './comment';
import { fetchCommentForMovie } from '@/services/commentService';
import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

type Props = {
    movieId: number;
};

const CommentSection = ({ movieId }: Props) => {
    const [listComments, setListComments] = useState<Array<Comment>>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            const res = await fetchCommentForMovie(movieId);
            setListComments(res);
            setLoading(false);
        };

        fetchComments();
    }, [movieId]);

    const handleSuccessAddComment = (c: Comment) => {
        setListComments((prev) => [c, ...prev]);
    };

    return (
        <section className="antialiased">
            <h3 className="mb-3 text-xl">Discussion</h3>
            <CommentForm labelSubmit="Post comment" movieId={movieId} onSuccess={handleSuccessAddComment} />
            {!loading ? (
                listComments.map((c) => <Comment key={c.id} movieId={movieId} commentInfo={c} />)
            ) : (
                <div className="flex justify-center py-3">
                    <LoaderCircle className="size-7 animate-spin text-primary" />
                </div>
            )}
        </section>
    );
};

export default CommentSection;
