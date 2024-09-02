package com.moonmovie.reservation_service.services.Impl;

import com.moonmovie.reservation_service.dao.OrderDao;
import com.moonmovie.reservation_service.dao.TicketDao;
import com.moonmovie.reservation_service.dto.MovieDto;
import com.moonmovie.reservation_service.dto.SeatDetailDto;
import com.moonmovie.reservation_service.feign.MovieServiceInterface;
import com.moonmovie.reservation_service.feign.SeatServiceInterface;
import com.moonmovie.reservation_service.models.Order;
import com.moonmovie.reservation_service.models.Ticket;
import com.moonmovie.reservation_service.requests.OrderRequest;
import com.moonmovie.reservation_service.responses.PaginationResponse;
import com.moonmovie.reservation_service.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    public Order addNewOrder(OrderRequest request) {
//        List<Ticket> ticketsSaved = ticketDao.saveAll(request.getTickets());
//        Order order = Order.builder()
//                .amount(request.getAmount())
//                .serviceFee((int) (request.getAmount() * 0.05))
//                .customerId(request.getCustomerId())
//                .timestamp(LocalDateTime.now())
//                .orderStatus("pending")
//                .tickets(ticketsSaved)
//                .build();
//        return orderDao.save(order);
        MovieDto movieDto = movieServiceInterface.getMovieInforFromShowing(request.getShowingId()).getBody();
        List<SeatDetailDto> seatDetailDtos = seatServiceInterface.fetchInfoSeatDetail(request.getShowingId(), request.getCustomerId()).getBody();
        System.out.println(movieDto);
        System.out.println(seatDetailDtos);
        return null;
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
