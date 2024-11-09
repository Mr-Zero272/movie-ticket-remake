package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.dto.TicketDto;
import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.responses.PaginationResponse;

import java.util.List;

public interface TicketService {
    public Ticket getTicketById(String ticketId);
    public PaginationResponse<Ticket> getTickets(int page, int size, String filter, String userId);

    List<Ticket> getTicketsByShowingId(int showingId);

    List<Ticket> getTicketsByOrderId(String orderId);

    TicketDto convertTicketToTicketDto(Ticket ticket);

    void sendTicketsToCusByMail(List<Ticket> tickets, String email);
}
