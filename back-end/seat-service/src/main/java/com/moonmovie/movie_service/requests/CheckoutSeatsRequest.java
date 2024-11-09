package com.moonmovie.movie_service.requests;

import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Getter
public class CheckoutSeatsRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    List<String> seatIds;
    String customerId;
}
