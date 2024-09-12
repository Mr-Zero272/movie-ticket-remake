package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.responses.PaginationResponse;

public interface TicketService {
    public Ticket getTicketById(String ticketId);
    public PaginationResponse<Ticket> getTickets(int page, int size, String filter, String userId);
}
