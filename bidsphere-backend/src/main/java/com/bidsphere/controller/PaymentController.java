package com.bidsphere.controller;

import com.bidsphere.dto.request.PaymentRequest;
import com.bidsphere.dto.response.PaymentResponse;
import com.bidsphere.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Auction checkout and payment management APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/auction/{auctionId}")
    @Operation(summary = "Process payment for a won closed auction")
    public ResponseEntity<PaymentResponse> processPayment(
            @PathVariable Long auctionId,
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.processPayment(auctionId, request, userDetails.getUsername()));
    }

    @GetMapping("/auction/{auctionId}")
    @Operation(summary = "Get payment details for a specific auction")
    public ResponseEntity<PaymentResponse> getPaymentByAuctionId(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(paymentService.getPaymentByAuctionId(auctionId, userDetails.getUsername()));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's payment history (paginated)")
    public ResponseEntity<Page<PaymentResponse>> getMyPayments(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(paymentService.getMyPayments(userDetails.getUsername(), pageable));
    }
}
