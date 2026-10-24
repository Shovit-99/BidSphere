package com.bidsphere.service;

import com.bidsphere.dto.response.WatchlistResponse;
import com.bidsphere.entity.Auction;
import com.bidsphere.entity.User;
import com.bidsphere.entity.Watchlist;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.UserRepository;
import com.bidsphere.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;
    private final AuctionService auctionService;

    @Transactional
    public WatchlistResponse addToWatchlist(Long auctionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with id: " + auctionId));

        if (watchlistRepository.existsByUserIdAndAuctionId(user.getId(), auctionId)) {
            throw new BadRequestException("Auction is already in your watchlist");
        }

        Watchlist watchlist = Watchlist.builder()
                .user(user)
                .auction(auction)
                .build();
        watchlistRepository.save(watchlist);

        log.info("Auction {} added to watchlist for user {}", auctionId, userEmail);
        return mapToResponse(watchlist);
    }

    @Transactional
    public void removeFromWatchlist(Long auctionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!watchlistRepository.existsByUserIdAndAuctionId(user.getId(), auctionId)) {
            throw new ResourceNotFoundException("Auction is not in your watchlist");
        }

        watchlistRepository.deleteByUserIdAndAuctionId(user.getId(), auctionId);
        log.info("Auction {} removed from watchlist for user {}", auctionId, userEmail);
    }

    @Transactional(readOnly = true)
    public Page<WatchlistResponse> getUserWatchlist(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return watchlistRepository.findByUserId(user.getId(), pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public boolean isAuctionInWatchlist(Long auctionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return watchlistRepository.existsByUserIdAndAuctionId(user.getId(), auctionId);
    }

    private WatchlistResponse mapToResponse(Watchlist watchlist) {
        return WatchlistResponse.builder()
                .id(watchlist.getId())
                .auctionId(watchlist.getAuction().getId())
                .auction(auctionService.mapToResponse(watchlist.getAuction()))
                .createdAt(watchlist.getCreatedAt())
                .build();
    }
}
