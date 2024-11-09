package com.moonmovie.movie_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketDto {
    private String title;
    private LocalDateTime date;
    private String dateFormat;
    private String begins;
    private String hall;
    private String row;
    private int seat;
    private String id;
    private int price;
}
