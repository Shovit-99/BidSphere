package com.bidsphere.service;

import com.bidsphere.dto.request.PlaceBidRequest;
import com.bidsphere.dto.response.AuctionUpdateMessage;
import com.bidsphere.dto.response.BidResponse;
import com.bidsphere.entity.Auction;
import com.bidsphere.entity.Bid;
import com.bidsphere.entity.User;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.BidRepository;
import com.bidsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Bidding engine - the core of the project.
 * All bid logic runs inside a single @Transactional method.
 * Concurrency is handled by @Version optimistic locking on Auction.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @Value("${app.auction.snipe-threshold-minutes:2}")
    private int snipeThresholdMinutes;

    @Value("${app.auction.snipe-extension-minutes:2}")
    private int snipeExtensionMinutes;

    /**
     * Place a bid on an auction.
     * Steps (all inside one @Transactional method):
     * 1. Load the auction
     * 2. Reject if status != ACTIVE or time past end_time
     * 3. Reject if bidder is the seller
     * 4. Reject if amount < current_price + min_increment
     * 5. Save the bid
     * 6. Update current_price and highest_bidder_id
     * 7. Anti-sniping: extend end time if bid is in last N minutes
     * 8. Broadcast over WebSocket
     * 9. Notify the outbid user
     */
    @Transactional
    public BidResponse placeBid(Long auctionId, PlaceBidRequest request, String bidderEmail) {
        // 1. Load auction
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));

        User bidder = userRepository.findByEmail(bidderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. Check auction status and time
        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new BadRequestException("This auction is not currently active");
        }

        if (LocalDateTime.now().isAfter(auction.getEndTime())) {
            throw new BadRequestException("This auction has already ended");
        }

        // 3. Seller cannot bid on own item
        if (auction.getItem().getSeller().getId().equals(bidder.getId())) {
            throw new BadRequestException("You cannot bid on your own auction");
        }

        // 4. Validate bid amount
        BigDecimal minimumBid = auction.getCurrentPrice().add(auction.getMinIncrement());
        if (request.getAmount().compareTo(minimumBid) < 0) {
            throw new BadRequestException(
                    String.format("Bid must be at least %s (current price %s + minimum increment %s)",
                            minimumBid, auction.getCurrentPrice(), auction.getMinIncrement()));
        }

        // Track previous highest bidder for notification
        User previousHighestBidder = auction.getHighestBidder();

        // 5. Save the bid
        Bid bid = Bid.builder()
                .auction(auction)
                .bidder(bidder)
                .amount(request.getAmount())
                .build();
        bidRepository.save(bid);

        // 6. Update auction
        auction.setCurrentPrice(request.getAmount());
        auction.setHighestBidder(bidder);
        auction.setBidCount(auction.getBidCount() + 1);

        // 7. Anti-sniping: extend end time if bid is within threshold
        LocalDateTime snipeThreshold = auction.getEndTime().minusMinutes(snipeThresholdMinutes);
        if (LocalDateTime.now().isAfter(snipeThreshold)) {
            auction.setEndTime(auction.getEndTime().plusMinutes(snipeExtensionMinutes));
            log.info("Anti-snipe: Auction {} end time extended to {}", auctionId, auction.getEndTime());
        }

        auctionRepository.save(auction);
        // Hibernate will throw OptimisticLockingFailureException if version mismatch

        log.info("Bid placed: auction={}, bidder={}, amount={}", auctionId, bidderEmail, request.getAmount());

        // 8. Broadcast over WebSocket
        AuctionUpdateMessage updateMessage = AuctionUpdateMessage.builder()
                .auctionId(auctionId)
                .currentPrice(auction.getCurrentPrice())
                .highestBidderName(bidder.getName())
                .endTime(auction.getEndTime())
                .bidCount(auction.getBidCount())
                .build();
        messagingTemplate.convertAndSend("/topic/auction/" + auctionId, updateMessage);

        // 9. Notify the outbid user (async)
        if (previousHighestBidder != null && !previousHighestBidder.getId().equals(bidder.getId())) {
            notificationService.notifyOutbid(previousHighestBidder, auction);
        }

        return BidResponse.builder()
                .id(bid.getId())
                .auctionId(auctionId)
                .bidderId(bidder.getId())
                .bidderName(bidder.getName())
                .amount(bid.getAmount())
                .createdAt(bid.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<BidResponse> getBidHistory(Long auctionId, Pageable pageable) {
        return bidRepository.findByAuctionIdOrderByCreatedAtDesc(auctionId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<BidResponse> getMyBids(String bidderEmail, Pageable pageable) {
        User bidder = userRepository.findByEmail(bidderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bidRepository.findByBidderIdOrderByCreatedAtDesc(bidder.getId(), pageable)
                .map(this::mapToResponse);
    }

    private BidResponse mapToResponse(Bid bid) {
        return BidResponse.builder()
                .id(bid.getId())
                .auctionId(bid.getAuction().getId())
                .bidderId(bid.getBidder().getId())
                .bidderName(bid.getBidder().getName())
                .amount(bid.getAmount())
                .createdAt(bid.getCreatedAt())
                .build();
    }
}
