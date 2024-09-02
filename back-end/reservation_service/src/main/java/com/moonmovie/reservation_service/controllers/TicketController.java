package com.moonmovie.reservation_service.controllers;

import com.moonmovie.reservation_service.models.Ticket;
import com.moonmovie.reservation_service.responses.PaginationResponse;
import com.moonmovie.reservation_service.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v2/moon-movie/reservation/order/ticket")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping("/{ticketId}")
    public ResponseEntity<Ticket> fetchTicketById(@PathVariable("ticketId") String ticketId) {
        return ResponseEntity.ok(ticketService.getTicketById(ticketId));
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<Ticket>> fetchTickets(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ticketService.getTickets(page, size));
    }
}
