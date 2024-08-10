package com.thuongmoon.movieservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PaginationResponse<T> {
    private List<T> data;
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;
}
