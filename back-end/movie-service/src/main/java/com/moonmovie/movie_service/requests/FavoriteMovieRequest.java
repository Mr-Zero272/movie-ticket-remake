package com.moonmovie.movie_service.requests;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FavoriteMovieRequest {
    private int movieId;
    private String userId;
}
