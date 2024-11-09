package com.moonmovie.movie_service.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PaginationResponse<T> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private List<T> data;
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;
}
