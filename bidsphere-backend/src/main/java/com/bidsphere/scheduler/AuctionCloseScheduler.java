package com.bidsphere.scheduler;

import com.bidsphere.entity.Auction;
import com.bidsphere.entity.Payment;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.entity.enums.PaymentStatus;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.PaymentRepository;
import com.bidsphere.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled task that closes expired auctions every 30 seconds.
 * Idempotent: only processes ACTIVE auctions past their end_time.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuctionCloseScheduler {

    private final AuctionRepository auctionRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedRateString = "${app.auction.close-rate-ms}")
    @Transactional
    public void closeExpiredAuctions() {
        List<Auction> expiredAuctions = auctionRepository
                .findByStatusAndEndTimeBefore(AuctionStatus.ACTIVE, LocalDateTime.now());

        if (expiredAuctions.isEmpty()) {
            return;
        }

        log.info("Closing {} expired auction(s)", expiredAuctions.size());

        for (Auction auction : expiredAuctions) {
            try {
                if (auction.getHighestBidder() != null) {
                    // Auction has a winner
                    auction.setStatus(AuctionStatus.CLOSED);
                    auctionRepository.save(auction);

                    // Create pending payment record if not present
                    if (!paymentRepository.existsByAuctionId(auction.getId())) {
                        Payment pendingPayment = Payment.builder()
                                .auction(auction)
                                .user(auction.getHighestBidder())
                                .amount(auction.getCurrentPrice())
                                .status(PaymentStatus.PENDING)
                                .build();
                        paymentRepository.save(pendingPayment);
                    }

                    // Notify winner and seller
                    notificationService.notifyWinner(auction.getHighestBidder(), auction);
                    notificationService.notifySellerAuctionEnded(
                            auction.getItem().getSeller(), auction, true);

                    log.info("Auction {} CLOSED. Winner: {}, Price: {}",
                            auction.getId(),
                            auction.getHighestBidder().getEmail(),
                            auction.getCurrentPrice());
                } else {
                    // No bids - mark as unsold
                    auction.setStatus(AuctionStatus.UNSOLD);
                    auctionRepository.save(auction);

                    notificationService.notifySellerAuctionEnded(
                            auction.getItem().getSeller(), auction, false);

                    log.info("Auction {} ended UNSOLD", auction.getId());
                }
            } catch (Exception e) {
                log.error("Error closing auction {}: {}", auction.getId(), e.getMessage());
            }
        }
    }
}
