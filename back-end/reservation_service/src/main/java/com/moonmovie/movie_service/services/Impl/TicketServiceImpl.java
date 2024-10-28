package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.ReservationErrorConstants;
import com.moonmovie.movie_service.dao.TicketDao;
import com.moonmovie.movie_service.exceptions.ReservationException;
import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.TicketService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public PaginationResponse<Ticket> getTickets(int page, int size, String filter, String userId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Ticket> ticketList = new ArrayList<>();
        Integer ticketsCount = 0;

        switch (filter.toLowerCase()) {
            case "all":
                ticketList = ticketDao.findAllTicketsFilterAll(userId, pageable);
                if (!ticketList.isEmpty()) {
                    ticketsCount = ticketDao.countTicketsFilterAll(userId);
                }
                break;
            case "active":
                ticketList = ticketDao.findAllTicketsFilterActiveOrExpired(userId, LocalDateTime.now(), pageable);
                if (!ticketList.isEmpty()) {
                    ticketsCount = ticketDao.countTicketsFilterActiveOrExpired(userId, LocalDateTime.now());
                }
                break;
            case "expired":
                ticketList = ticketDao.findAllTicketsFilterActiveOrExpired(userId, LocalDateTime.of(1900, 1, 1, 0, 0), pageable);
                if (!ticketList.isEmpty()) {
                    ticketsCount = ticketDao.countTicketsFilterActiveOrExpired(userId, LocalDateTime.of(1900, 1, 1, 0, 0));
                }
                break;
            case "unpaid":
                ticketList = ticketDao.findAllTicketsFilterUnpaid(userId, pageable);
                if (!ticketList.isEmpty()) {
                    ticketsCount = ticketDao.countTicketsFilterUnpaid(userId);
                }
                break;
            default:
                throw new ReservationException(ReservationErrorConstants.ERROR_NOT_EXIST_FILTER_TICKET);
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

    @Override
    public List<Ticket> getTicketsByShowingId(int showingId) {
        return ticketDao.findAllByShowingId(showingId);
    }

    @Override
    public List<Ticket> getTicketsByOrderId(String orderId) {
        return ticketDao.findAllByOrderId(orderId);
    }
}
