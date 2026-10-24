package com.bidsphere.controller;

import com.bidsphere.dto.response.AuctionResponse;
import com.bidsphere.dto.response.PaymentResponse;
import com.bidsphere.dto.response.UserResponse;
import com.bidsphere.entity.Auction;
import com.bidsphere.entity.Category;
import com.bidsphere.entity.User;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.BidRepository;
import com.bidsphere.repository.CategoryRepository;
import com.bidsphere.repository.UserRepository;
import com.bidsphere.service.AuctionService;
import com.bidsphere.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Administrative operations and system analytics")
public class AdminController {

    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final CategoryRepository categoryRepository;
    private final AuctionService auctionService;
    private final PaymentService paymentService;

    @GetMapping("/users")
    @Operation(summary = "Get all users in the system (paginated)")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserResponse> users = userRepository.findAll(pageable)
                .map(this::mapUserToResponse);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/toggle")
    @Operation(summary = "Enable or disable a user account")
    public ResponseEntity<UserResponse> toggleUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        return ResponseEntity.ok(mapUserToResponse(user));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new auction category")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryRepository.save(category));
    }

    @GetMapping("/auctions")
    @Operation(summary = "Get all auctions across the platform with optional status filter")
    public ResponseEntity<Page<AuctionResponse>> getAllAuctions(
            @RequestParam(required = false) AuctionStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Auction> auctions = (status != null)
                ? auctionRepository.findByStatus(status, pageable)
                : auctionRepository.findAll(pageable);
        return ResponseEntity.ok(auctions.map(auctionService::mapToResponse));
    }

    @PutMapping("/auctions/{id}/cancel")
    @Operation(summary = "Force cancel an auction as admin")
    public ResponseEntity<Map<String, String>> cancelAuctionByAdmin(@PathVariable Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with id: " + id));
        auction.setStatus(AuctionStatus.CANCELLED);
        auctionRepository.save(auction);
        return ResponseEntity.ok(Map.of("message", "Auction cancelled successfully by admin"));
    }

    @GetMapping("/payments")
    @Operation(summary = "Get all transactions across the platform (paginated)")
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(paymentService.getAllPayments(pageable));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get comprehensive platform analytics and stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeAuctions", auctionRepository.countByStatus(AuctionStatus.ACTIVE));
        stats.put("closedAuctions", auctionRepository.countByStatus(AuctionStatus.CLOSED));
        stats.put("totalBids", bidRepository.count());
        stats.put("totalCategories", categoryRepository.count());

        Map<String, Object> paymentStats = paymentService.getPaymentStats();
        stats.putAll(paymentStats);

        return ResponseEntity.ok(stats);
    }

    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
