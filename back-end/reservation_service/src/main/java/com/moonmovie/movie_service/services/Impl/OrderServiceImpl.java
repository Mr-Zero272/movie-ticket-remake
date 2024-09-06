package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.ReservationErrorConstants;
import com.moonmovie.movie_service.dao.OrderDao;
import com.moonmovie.movie_service.dao.TicketDao;
import com.moonmovie.movie_service.dto.MovieDto;
import com.moonmovie.movie_service.dto.SeatDetailDto;
import com.moonmovie.movie_service.exceptions.ReservationException;
import com.moonmovie.movie_service.feign.MovieServiceInterface;
import com.moonmovie.movie_service.feign.SeatServiceInterface;
import com.moonmovie.movie_service.models.Order;
import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.requests.OrderRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderDao orderDao;
    @Autowired
    private TicketDao ticketDao;
    @Autowired
    private MovieServiceInterface movieServiceInterface;
    @Autowired
    private SeatServiceInterface seatServiceInterface;

    @Override
    @Transactional
    public Order addNewOrder(OrderRequest request) {
        List<Ticket> tickets = new ArrayList<>();
        MovieDto movieDto = new MovieDto();
        List<SeatDetailDto> seatDetailDtos = new ArrayList<>();
        try {
            movieDto = movieServiceInterface.getMovieInforFromShowing(request.getShowingId()).getBody();
            seatDetailDtos = seatServiceInterface.fetchInfoSeatDetail(request.getShowingId(), request.getCustomerId()).getBody();
        } catch (Exception e) {
            throw new ReservationException(ReservationErrorConstants.ERROR_UNABLE_TO_COMMUNICATE_WITH_OTHER_SERVICE);
        }

        if (seatDetailDtos != null && seatDetailDtos.isEmpty()) {
            throw new ReservationException(ReservationErrorConstants.ERROR_NO_SEAT_TO_CHECKOUT);
        }

        int amount = seatDetailDtos.stream().mapToInt(SeatDetailDto::getPrice).sum();

        Order order = new Order();
        order.setAmount(amount);
        order.setServiceFee((int) (amount * 0.05));
        order.setCustomerId(request.getCustomerId());
        order.setOrderStatus("pending");
        order.setTimestamp(LocalDateTime.now());

        Order orderSaved = orderDao.save(order);

        for (SeatDetailDto seatDetailDto : seatDetailDtos) {
            tickets.add(Ticket.builder()
                    .seatId(seatDetailDto.getId())
                    .movieTitle(movieDto.getTitle())
                    .moviePoster(movieDto.getPosterPath())
                    .date(request.getShowingTime())
                    .runtime(movieDto.getRuntime())
                    .seatNumber(seatDetailDto.getSeatNumber())
                    .seatRow(seatDetailDto.getSeatRow())
                    .price(seatDetailDto.getPrice())
                    .hall(seatDetailDto.getHall())
                    .address(seatDetailDto.getAddress())
                    .showingId(request.getShowingId())
                    .orderId(orderSaved.getId())
                    .build());
        }

        ticketDao.saveAll(tickets);
        return orderSaved;
    }

    @Override
    public PaginationResponse getOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<Order> orderPage = orderDao.findAll(pageable);

        PaginationResponse<Order> resp = PaginationResponse.<Order>builder()
                .data(orderPage.getContent())
                .page(page)
                .size(size)
                .totalPages(orderPage.getTotalPages())
                .totalElements(orderPage.getTotalElements())
                .build();
        return resp;
    }
}
