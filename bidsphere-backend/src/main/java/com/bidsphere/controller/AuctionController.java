package com.bidsphere.controller;

import com.bidsphere.dto.request.CreateAuctionRequest;
import com.bidsphere.dto.response.AuctionResponse;
import com.bidsphere.service.AuctionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
@Tag(name = "Auctions", description = "Auction listing, searching, creation and management APIs")
public class AuctionController {

    private final AuctionService auctionService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create a new auction with optional item image")
    public ResponseEntity<AuctionResponse> createAuction(
            @Valid @RequestPart("auction") CreateAuctionRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(auctionService.createAuction(request, userDetails.getUsername(), image));
    }

    @GetMapping
    @Operation(summary = "Get active auctions sorted by end time (paginated)")
    public ResponseEntity<Page<AuctionResponse>> getActiveAuctions(
            @PageableDefault(size = 12, sort = "endTime", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(auctionService.getActiveAuctions(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full details of a specific auction by ID")
    public ResponseEntity<AuctionResponse> getAuction(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getAuction(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search active auctions by item title or description")
    public ResponseEntity<Page<AuctionResponse>> searchAuctions(
            @RequestParam String keyword,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(auctionService.searchAuctions(keyword, pageable));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get active auctions filtered by category ID")
    public ResponseEntity<Page<AuctionResponse>> getByCategory(
            @PathVariable Long categoryId,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(auctionService.getAuctionsByCategory(categoryId, pageable));
    }

    @GetMapping("/my")
    @Operation(summary = "Get auctions created by the currently authenticated seller")
    public ResponseEntity<Page<AuctionResponse>> getMyAuctions(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(auctionService.getMyAuctions(userDetails.getUsername(), pageable));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update an auction before any bids are placed")
    public ResponseEntity<AuctionResponse> updateAuction(
            @PathVariable Long id,
            @Valid @RequestPart("auction") CreateAuctionRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(auctionService.updateAuction(id, request, userDetails.getUsername(), image));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel an auction (seller or admin only)")
    public ResponseEntity<Void> cancelAuction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        auctionService.cancelAuction(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
