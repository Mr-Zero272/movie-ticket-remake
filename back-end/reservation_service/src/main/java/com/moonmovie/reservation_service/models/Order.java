package com.moonmovie.reservation_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.io.Serial;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "order")
public class Order {

    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    private String id;
    private int amount;
    private int serviceFee;
    private String customerId;
    private String orderStatus;
    private LocalDateTime timestamp;

    @DocumentReference
    List<Ticket> tickets = new ArrayList<>();

    @DocumentReference
    List<Payment> payments = new ArrayList<>();

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
        return id != null && id.equals(((Order) obj).id);
    }
}
