package com.moonmovie.movie_service.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatDetailInfo {
    private String oldId;
    private String newId;
    private String rowSeat;
    private int numberSeat;
}
