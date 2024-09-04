package com.moonmovie.reservation_service.services;

import com.moonmovie.reservation_service.models.Ticket;
import com.moonmovie.reservation_service.responses.PaginationResponse;

public interface TicketService {
    public Ticket getTicketById(String ticketId);
    public PaginationResponse<Ticket> getTickets(int page, int size, String orderStatus, String userId);
}
