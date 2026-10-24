package com.bidsphere.repository;

import com.bidsphere.entity.Bid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    /**
     * Get bid history for an auction, ordered by amount descending.
     */
    List<Bid> findByAuctionIdOrderByAmountDesc(Long auctionId);

    /**
     * Get paginated bid history for an auction.
     */
    Page<Bid> findByAuctionIdOrderByCreatedAtDesc(Long auctionId, Pageable pageable);

    /**
     * Get all bids by a specific bidder.
     */
    Page<Bid> findByBidderIdOrderByCreatedAtDesc(Long bidderId, Pageable pageable);

    /**
     * Count bids on an auction.
     */
    long countByAuctionId(Long auctionId);

    /**
     * Check if a bid exists for an auction (to block edits).
     */
    boolean existsByAuctionId(Long auctionId);

    /**
     * Count total bids placed by a bidder.
     */
    long countByBidderId(Long bidderId);
}
