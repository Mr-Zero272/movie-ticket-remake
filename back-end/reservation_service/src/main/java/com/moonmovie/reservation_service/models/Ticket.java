package com.moonmovie.reservation_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "ticket")
public class Ticket {

    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    private String id;
    private String movieTitle;
    private String moviePoster;
    private LocalDateTime date;
    private int runtime;
    private int seatNumber;
    private String seatRow;
    private int price;
    private String hall;
    private String address;
    private String showingId;
    private String orderId;

    @Override
    public int hashCode() {
        return 2024;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        return id != null && id.equals(((Ticket) obj).id);
    }
}
