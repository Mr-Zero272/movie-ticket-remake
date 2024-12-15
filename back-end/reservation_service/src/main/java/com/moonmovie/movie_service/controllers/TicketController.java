package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.models.TicketsSoldStatistical;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v2/moon-movie/reservation/ticket")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping("/{ticketId}")
    public ResponseEntity<Ticket> fetchTicketById(@PathVariable("ticketId") String ticketId) {
        return ResponseEntity.ok(ticketService.getTicketById(ticketId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Ticket>> fetchTicketByOrderId(@PathVariable("orderId") String orderId) {
        return ResponseEntity.ok(ticketService.getTicketsByOrderId(orderId));
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<Ticket>> fetchTickets(
            @RequestHeader("user-id")  String userId,
            @RequestParam("filter") String filter,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ticketService.getTickets(page, size, filter, userId));
    }

    @GetMapping("/showing/total/{showingId} ")
    public ResponseEntity<Integer> getTotalTicketsByShowingId(@PathVariable("showingId") int showingId) {
        return ResponseEntity.ok(ticketService.getTicketsByShowingId(showingId).size());
    }

    @GetMapping("/statistical")
    public ResponseEntity<PaginationResponse<TicketsSoldStatistical>> fetchTicketsByStatistical(
            @RequestParam(value = "sort", defaultValue = "none", required = false) String sort,
            @RequestParam(value = "sortOrder", defaultValue = "asc", required = false) String sortOrder,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ticketService.fetchTicketsByStatistical(sort, sortOrder, page, size));
    }
}
