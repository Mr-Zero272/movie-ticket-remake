package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.ReservationErrorConstants;
import com.moonmovie.movie_service.dao.TicketDao;
import com.moonmovie.movie_service.dto.TicketDto;
import com.moonmovie.movie_service.exceptions.ReservationException;
import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.models.TicketsSoldStatistical;
import com.moonmovie.movie_service.requests.SeatDetailInfo;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.MailService;
import com.moonmovie.movie_service.services.TicketService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketDao ticketDao;

    @Autowired
    private MailService mailService;

    @Override
    public Ticket getTicketById(String ticketId) {
        Ticket ticket = ticketDao.findById(ticketId).orElseThrow(() -> new ReservationException(ReservationErrorConstants.ERROR_TICKET_NOT_EXIST));
        return ticket;
    }

    @Override
    public PaginationResponse<Ticket> getTickets(int page, int size, String filter, String userId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Ticket> ticketPage = switch (filter.toLowerCase()) {
            case "all" -> ticketDao.findALlByUserId(userId, pageable);
            case "active" -> ticketDao.findAllByUserIdAndDateAfter(userId, LocalDateTime.now(), pageable);
            case "expired" -> ticketDao.findAllByUserIdAndDateBefore(userId, LocalDateTime.now(), pageable);
            case "unpaid" -> ticketDao.findALlByUserIdAndStatus(userId, "unpaid", pageable);
            default -> throw new ReservationException(ReservationErrorConstants.ERROR_NOT_EXIST_FILTER_TICKET);
        };

        return PaginationResponse.<Ticket>builder()
                .data(ticketPage.getContent())
                .page(page)
                .size(size)
                .totalPages(ticketPage.getTotalPages())
                .totalElements(ticketPage.getTotalElements())
                .build();
    }

    @Override
    public List<Ticket> getTicketsByShowingId(int showingId) {
        return ticketDao.findAllByShowingId(showingId);
    }

    @Override
    public List<Ticket> getTicketsByOrderId(String orderId) {
        return ticketDao.findAllByOrderId(orderId);
    }

    @Override
    public TicketDto convertTicketToTicketDto(Ticket ticket) {
        DateTimeFormatter sdfDate = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        DateTimeFormatter sdfTime = DateTimeFormatter.ofPattern("h:mm a");
        TicketDto ticketDto = new TicketDto();
        ticketDto.setId(ticket.getId().substring(15));
        ticketDto.setTitle(ticket.getMovieTitle());
        ticketDto.setDate(ticket.getDate());
        ticketDto.setDateFormat(sdfDate.format(ticket.getDate()));
        ticketDto.setBegins(sdfTime.format(ticket.getDate()));
        ticketDto.setHall(ticket.getHall());
        ticketDto.setRow(ticket.getSeatRow());
        ticketDto.setSeat(ticket.getSeatNumber());
        ticketDto.setPrice(ticket.getPrice());
        return ticketDto;
    }

    @Override
    public void sendTicketsToCusByMail(List<Ticket> tickets, String email) {
        List<TicketDto> ticketDtos = new ArrayList<>();
        tickets.forEach(ticket -> ticketDtos.add(this.convertTicketToTicketDto(ticket)));
        Context context = new Context();
        context.setVariable("tickets", ticketDtos);
        mailService.sendEmailWithHtmlTemplate(email, "Thank for your order!", "ticketMail", context);
    }

    @Override
    public PaginationResponse<TicketsSoldStatistical> fetchTicketsByStatistical(String sort, String sortOrder,int page,
                                                                                int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Integer ticketsCount = ticketDao.countSoldStatistical();
        List<TicketsSoldStatistical> ticketsSoldStatisticalList = new ArrayList<>();
        if (sortOrder.equals("asc")) {
            ticketsSoldStatisticalList = ticketDao.findAllSoldStatistical(sort, -1, pageable);
        } else {
            ticketsSoldStatisticalList = ticketDao.findAllSoldStatistical(sort, 1, pageable);
        }
        Page<TicketsSoldStatistical> ticketPage = new PageImpl<>(ticketsSoldStatisticalList, pageable, ticketsCount);

        PaginationResponse<TicketsSoldStatistical> resp = PaginationResponse.<TicketsSoldStatistical>builder()
                .data(ticketPage.getContent())
                .page(page)
                .size(size)
                .totalPages(ticketPage.getTotalPages())
                .totalElements(ticketPage.getTotalElements())
                .build();
        return resp;
    }

    @Override
    public List<Ticket> updateSeatPosition(SeatDetailInfo seatDetailInfo) {
        List<Ticket> tickets = ticketDao.findAllBySeatId(seatDetailInfo.getOldId());
        tickets.forEach(t -> {
            t.setSeatId(seatDetailInfo.getNewId());
            t.setSeatNumber(seatDetailInfo.getNumberSeat());
            t.setSeatRow(seatDetailInfo.getRowSeat());
        });
        return ticketDao.saveAll(tickets);
    }
}
