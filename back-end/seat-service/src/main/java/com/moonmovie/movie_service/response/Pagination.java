package com.moonmovie.movie_service.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Pagination {
    private int size;
    private int currentPage;
    private int totalPage;
    private int totalResult;
}
