package com.bidsphere.service;

import com.bidsphere.dto.response.AuctionResponse;
import com.bidsphere.dto.response.WatchlistResponse;
import com.bidsphere.entity.*;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.entity.enums.Role;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.UserRepository;
import com.bidsphere.repository.WatchlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WatchlistServiceTest {

    @Mock
    private WatchlistRepository watchlistRepository;

    @Mock
    private AuctionRepository auctionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuctionService auctionService;

    @InjectMocks
    private WatchlistService watchlistService;

    private User user;
    private Auction auction;
    private Watchlist watchlist;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Sam Watcher")
                .email("sam@example.com")
                .role(Role.ROLE_BIDDER)
                .build();

        Item item = Item.builder()
                .id(1L)
                .title("Watch")
                .build();

        auction = Auction.builder()
                .id(10L)
                .item(item)
                .currentPrice(BigDecimal.valueOf(200))
                .status(AuctionStatus.ACTIVE)
                .build();

        watchlist = Watchlist.builder()
                .id(100L)
                .user(user)
                .auction(auction)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void addToWatchlist_Success() {
        when(userRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(user));
        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));
        when(watchlistRepository.existsByUserIdAndAuctionId(1L, 10L)).thenReturn(false);
        when(watchlistRepository.save(any(Watchlist.class))).thenReturn(watchlist);
        when(auctionService.mapToResponse(auction)).thenReturn(AuctionResponse.builder().id(10L).title("Watch").build());

        WatchlistResponse response = watchlistService.addToWatchlist(10L, "sam@example.com");

        assertNotNull(response);
        assertEquals(10L, response.getAuctionId());
        verify(watchlistRepository).save(any(Watchlist.class));
    }

    @Test
    void addToWatchlist_AlreadyExists_ThrowsBadRequest() {
        when(userRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(user));
        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));
        when(watchlistRepository.existsByUserIdAndAuctionId(1L, 10L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> watchlistService.addToWatchlist(10L, "sam@example.com"));
    }

    @Test
    void removeFromWatchlist_Success() {
        when(userRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.existsByUserIdAndAuctionId(1L, 10L)).thenReturn(true);

        watchlistService.removeFromWatchlist(10L, "sam@example.com");

        verify(watchlistRepository).deleteByUserIdAndAuctionId(1L, 10L);
    }

    @Test
    void removeFromWatchlist_NotFound_ThrowsException() {
        when(userRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.existsByUserIdAndAuctionId(1L, 10L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> watchlistService.removeFromWatchlist(10L, "sam@example.com"));
    }

    @Test
    void getUserWatchlist_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        when(userRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.findByUserId(1L, pageable)).thenReturn(new PageImpl<>(List.of(watchlist)));
        when(auctionService.mapToResponse(auction)).thenReturn(AuctionResponse.builder().id(10L).title("Watch").build());

        Page<WatchlistResponse> page = watchlistService.getUserWatchlist("sam@example.com", pageable);

        assertNotNull(page);
        assertEquals(1, page.getTotalElements());
    }
}
