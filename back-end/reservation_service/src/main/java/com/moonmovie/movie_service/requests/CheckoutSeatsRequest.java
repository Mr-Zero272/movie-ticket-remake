package com.moonmovie.movie_service.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutSeatsRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    List<String> seatIds;
    String customerId;
}
