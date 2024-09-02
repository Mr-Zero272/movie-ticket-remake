package com.moonmovie.reservation_service.services.Impl;

import com.moonmovie.reservation_service.constants.ReservationErrorConstants;
import com.moonmovie.reservation_service.dao.TicketDao;
import com.moonmovie.reservation_service.exceptions.ReservationException;
import com.moonmovie.reservation_service.models.Order;
import com.moonmovie.reservation_service.models.Ticket;
import com.moonmovie.reservation_service.responses.PaginationResponse;
import com.moonmovie.reservation_service.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
    public PaginationResponse<Ticket> getTickets(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "date"));
        Page<Ticket> orderPage = ticketDao.findAll(pageable);

        PaginationResponse<Ticket> resp = PaginationResponse.<Ticket>builder()
                .data(orderPage.getContent())
                .page(page)
                .size(size)
                .totalPages(orderPage.getTotalPages())
                .totalElements(orderPage.getTotalElements())
                .build();
        return resp;
    }
}
