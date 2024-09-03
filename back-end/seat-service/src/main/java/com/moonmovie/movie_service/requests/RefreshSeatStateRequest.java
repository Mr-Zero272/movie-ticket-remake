package com.moonmovie.movie_service.requests;

import lombok.Data;

@Data
public class RefreshSeatStateRequest {
    private int showingId;
    private String userId;
}
