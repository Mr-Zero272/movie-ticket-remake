package com.moonmovie.movie_service.response;

import com.moonmovie.movie_service.models.SeatDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListSeatResponse {
    private List<SeatDetail> seats;
}
