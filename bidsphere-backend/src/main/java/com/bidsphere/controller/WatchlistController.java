package com.bidsphere.controller;

import com.bidsphere.dto.response.WatchlistResponse;
import com.bidsphere.service.WatchlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
@Tag(name = "Watchlist", description = "Watchlist management APIs")
public class WatchlistController {

    private final WatchlistService watchlistService;

    @PostMapping("/{auctionId}")
    @Operation(summary = "Add an auction to the user's watchlist")
    public ResponseEntity<WatchlistResponse> addToWatchlist(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(watchlistService.addToWatchlist(auctionId, userDetails.getUsername()));
    }

    @DeleteMapping("/{auctionId}")
    @Operation(summary = "Remove an auction from the user's watchlist")
    public ResponseEntity<Void> removeFromWatchlist(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        watchlistService.removeFromWatchlist(auctionId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get the authenticated user's watchlist items (paginated)")
    public ResponseEntity<Page<WatchlistResponse>> getUserWatchlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(watchlistService.getUserWatchlist(userDetails.getUsername(), pageable));
    }

    @GetMapping("/{auctionId}/status")
    @Operation(summary = "Check if an auction is in the user's watchlist")
    public ResponseEntity<Map<String, Boolean>> isAuctionInWatchlist(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean inWatchlist = watchlistService.isAuctionInWatchlist(auctionId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("inWatchlist", inWatchlist));
    }
}
