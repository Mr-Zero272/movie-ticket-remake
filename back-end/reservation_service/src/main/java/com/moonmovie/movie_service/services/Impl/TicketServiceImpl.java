package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.ReservationErrorConstants;
import com.moonmovie.movie_service.dao.TicketDao;
import com.moonmovie.movie_service.exceptions.ReservationException;
import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketDao ticketDao;

    @Override
    public Ticket getTicketById(String ticketId) {
        Ticket ticket = ticketDao.findById(ticketId).orElseThrow(() -> new ReservationException(ReservationErrorConstants.ERROR_TICKET_NOT_EXIST));
        return ticket;
    }

    @Override
    public PaginationResponse<Ticket> getTickets(int page, int size, String orderStatus, String userId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Ticket> ticketList = ticketDao.findPaidTicketsByUserId(userId, orderStatus, LocalDateTime.now(), pageable);
        Integer ticketsCount = 0;
        if (!ticketList.isEmpty()) {
            ticketsCount = ticketDao.countPaidTicketsByUserId(userId, orderStatus, LocalDateTime.now());
        }
        Page<Ticket> ticketPage = new PageImpl<>(ticketList, pageable, ticketsCount);

        PaginationResponse<Ticket> resp = PaginationResponse.<Ticket>builder()
                .data(ticketPage.getContent())
                .page(page)
                .size(size)
                .totalPages(ticketPage.getTotalPages())
                .totalElements(ticketPage.getTotalElements())
                .build();
        return resp;
    }
}
