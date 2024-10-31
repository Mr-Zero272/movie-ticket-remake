package com.moonmovie.movie_service.requests;

import lombok.Data;

@Data
public class AddCommentRequest {
    private String userId;;
    private String username;
    private String userProfileImage;
    private String content;
    private Integer movieId;
    private Integer parentCommentId;
}
