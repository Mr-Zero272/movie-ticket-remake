package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.dto.TicketDto;
import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.models.TicketsSoldStatistical;
import com.moonmovie.movie_service.requests.SeatDetailInfo;
import com.moonmovie.movie_service.responses.PaginationResponse;

import java.util.List;

public interface TicketService {
    public Ticket getTicketById(String ticketId);
    public PaginationResponse<Ticket> getTickets(int page, int size, String filter, String userId);

    List<Ticket> getTicketsByShowingId(int showingId);

    List<Ticket> getTicketsByOrderId(String orderId);

    TicketDto convertTicketToTicketDto(Ticket ticket);

    void sendTicketsToCusByMail(List<Ticket> tickets, String email);

    PaginationResponse<TicketsSoldStatistical> fetchTicketsByStatistical(String sort, String sortOrder,int page,
                                                                         int size);
    List<Ticket> updateSeatPosition(SeatDetailInfo seatDetailInfo);
}
