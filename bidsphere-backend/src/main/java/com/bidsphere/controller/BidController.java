package com.bidsphere.controller;

import com.bidsphere.dto.request.PlaceBidRequest;
import com.bidsphere.dto.response.BidResponse;
import com.bidsphere.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping("/auctions/{auctionId}/bids")
    public ResponseEntity<BidResponse> placeBid(
            @PathVariable Long auctionId,
            @Valid @RequestBody PlaceBidRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bidService.placeBid(auctionId, request, userDetails.getUsername()));
    }

    @GetMapping("/auctions/{auctionId}/bids")
    public ResponseEntity<Page<BidResponse>> getBidHistory(
            @PathVariable Long auctionId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bidService.getBidHistory(auctionId, pageable));
    }

    @GetMapping("/bids/my")
    public ResponseEntity<Page<BidResponse>> getMyBids(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bidService.getMyBids(userDetails.getUsername(), pageable));
    }
}
