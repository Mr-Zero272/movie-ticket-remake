package com.moonmovie.movie_service.responses;

import com.moonmovie.movie_service.dto.ShowingDto;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FutureShowingsResponse {
    private LocalDateTime date;
    private List<ShowingDto> showingDtos;
}
