package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.CommentDao;
import com.moonmovie.movie_service.dao.MovieDao;
import com.moonmovie.movie_service.exceptions.GlobalException;
import com.moonmovie.movie_service.models.Comment;
import com.moonmovie.movie_service.models.Movie;
import com.moonmovie.movie_service.requests.AddCommentRequest;
import com.moonmovie.movie_service.services.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentDao commentDao;

    @Autowired
    private MovieDao movieDao;

    @Override
    @Transactional
    public Comment addComment(AddCommentRequest request) {
        Movie movie = movieDao.findById(request.getMovieId()).orElseThrow(() -> new GlobalException(400,
                "This movie does not exists"));
        Comment comment = new Comment();
        comment.setMovie(movie);
        comment.setContent(request.getContent());
        comment.setUserId(request.getUserId());
        comment.setUsername(request.getUsername());
        comment.setUserProfileImage(request.getUserProfileImage());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setModifiedAt(LocalDateTime.now());

        Comment reply = commentDao.save(comment);
        if (request.getParentCommentId() != null) {
            Comment parentComment =
                    commentDao.findById(request.getParentCommentId()).orElseThrow(() -> new GlobalException(400,
                            "This parent comment does not exist"));
            parentComment.getChildComments().add(reply);
            commentDao.save(parentComment);
        }

        return reply;
    }

    @Override
    public Comment getCommentById(int id) {
        return commentDao.findById(id).orElseThrow(() -> new GlobalException(400,
                "This comment does not exist"));
    }

    @Override
    public List<Comment> getAllRepliesByCommentId(int id) {
        return commentDao.findRepliesByCommentId(id);
    }

    @Override
    public List<Comment> getAllCommentOfAnMovie(int movieId) {
        return commentDao.findFirstLevelCommentsByMovieId(movieId);
    }

    @Override
    public Comment updateComment(String content, Integer commentId) {
        Comment comment = commentDao.findById(commentId).orElseThrow(() -> new GlobalException(400,
                "This comment does not exist"));
        comment.setContent(content);
        comment.setModifiedAt(LocalDateTime.now());
        return commentDao.save(comment);
    }

    @Override
    public Comment deleteComment(int id) {
        Comment comment = commentDao.findById(id).orElseThrow(() -> new GlobalException(400,
                "This parent comment does not exist"));
        List<Comment> parents = comment.getParentComments();
        for (Comment parent : parents) {
            parent.getChildComments().remove(comment);
            commentDao.save(parent);
        }
        commentDao.delete(comment);
        return comment;
    }

}
