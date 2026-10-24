package com.bidsphere.service;

import com.bidsphere.dto.request.PaymentRequest;
import com.bidsphere.dto.response.PaymentResponse;
import com.bidsphere.entity.Auction;
import com.bidsphere.entity.Payment;
import com.bidsphere.entity.User;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.entity.enums.PaymentStatus;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.PaymentRepository;
import com.bidsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    /**
     * Process checkout/payment for a won auction.
     */
    @Transactional
    public PaymentResponse processPayment(Long auctionId, PaymentRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with id: " + auctionId));

        if (auction.getStatus() != AuctionStatus.CLOSED) {
            throw new BadRequestException("Payments can only be processed for closed auctions");
        }

        if (auction.getHighestBidder() == null || !auction.getHighestBidder().getId().equals(user.getId())) {
            throw new BadRequestException("Only the winning bidder can pay for this auction");
        }

        Payment payment = paymentRepository.findByAuctionId(auctionId)
                .orElseGet(() -> Payment.builder()
                        .auction(auction)
                        .user(user)
                        .amount(auction.getCurrentPrice())
                        .status(PaymentStatus.PENDING)
                        .build());

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            throw new BadRequestException("This auction has already been paid for");
        }

        // Process payment simulation
        String transactionRef = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionRef(transactionRef);
        payment.setAmount(auction.getCurrentPrice());
        payment.setUser(user);

        paymentRepository.save(payment);
        log.info("Payment completed: id={}, auctionId={}, amount={}, ref={}",
                payment.getId(), auctionId, payment.getAmount(), transactionRef);

        return mapToResponse(payment);
    }

    /**
     * Get payment details for a specific auction.
     */
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByAuctionId(Long auctionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with id: " + auctionId));

        Payment payment = paymentRepository.findByAuctionId(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment found for auction: " + auctionId));

        boolean isWinner = auction.getHighestBidder() != null && auction.getHighestBidder().getId().equals(user.getId());
        boolean isSeller = auction.getItem().getSeller().getId().equals(user.getId());
        boolean isAdmin = user.getRole().name().equals("ROLE_ADMIN");

        if (!isWinner && !isSeller && !isAdmin) {
            throw new BadRequestException("You are not authorized to view this payment");
        }

        return mapToResponse(payment);
    }

    /**
     * Get payment history for the authenticated user.
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getMyPayments(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return paymentRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get all payments (Admin).
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get revenue and payment statistics (Admin).
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getPaymentStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", paymentRepository.calculateTotalRevenue());
        stats.put("completedPayments", paymentRepository.countByStatus(PaymentStatus.COMPLETED));
        stats.put("pendingPayments", paymentRepository.countByStatus(PaymentStatus.PENDING));
        stats.put("failedPayments", paymentRepository.countByStatus(PaymentStatus.FAILED));
        return stats;
    }

    public PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .auctionId(payment.getAuction().getId())
                .auctionTitle(payment.getAuction().getItem().getTitle())
                .userId(payment.getUser().getId())
                .userName(payment.getUser().getName())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .transactionRef(payment.getTransactionRef())
                .paymentMethod(payment.getPaymentMethod())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
