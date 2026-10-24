package com.bidsphere.repository;

import com.bidsphere.entity.Watchlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    Page<Watchlist> findByUserId(Long userId, Pageable pageable);

    Optional<Watchlist> findByUserIdAndAuctionId(Long userId, Long auctionId);

    boolean existsByUserIdAndAuctionId(Long userId, Long auctionId);

    void deleteByUserIdAndAuctionId(Long userId, Long auctionId);

    List<Watchlist> findByAuctionId(Long auctionId);

    long countByUserId(Long userId);
}
