package com.bidsphere.service;

import com.bidsphere.dto.request.PlaceBidRequest;
import com.bidsphere.dto.response.BidResponse;
import com.bidsphere.entity.*;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.entity.enums.Role;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.BidRepository;
import com.bidsphere.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BidServiceTest {

    @Mock
    private BidRepository bidRepository;

    @Mock
    private AuctionRepository auctionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BidService bidService;

    private User bidder;
    private User seller;
    private Auction auction;
    private Item item;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(bidService, "snipeThresholdMinutes", 2);
        ReflectionTestUtils.setField(bidService, "snipeExtensionMinutes", 2);

        seller = User.builder()
                .id(1L)
                .name("Seller")
                .email("seller@example.com")
                .role(Role.ROLE_SELLER)
                .build();

        bidder = User.builder()
                .id(2L)
                .name("Bidder Bob")
                .email("bob@example.com")
                .role(Role.ROLE_BIDDER)
                .build();

        item = Item.builder()
                .id(1L)
                .title("MacBook Pro")
                .seller(seller)
                .build();

        auction = Auction.builder()
                .id(10L)
                .item(item)
                .startingPrice(BigDecimal.valueOf(500))
                .currentPrice(BigDecimal.valueOf(500))
                .minIncrement(BigDecimal.valueOf(50))
                .startTime(LocalDateTime.now().minusHours(1))
                .endTime(LocalDateTime.now().plusHours(2))
                .status(AuctionStatus.ACTIVE)
                .bidCount(0)
                .build();
    }

    @Test
    void placeBid_Success() {
        PlaceBidRequest request = PlaceBidRequest.builder()
                .amount(BigDecimal.valueOf(550))
                .build();

        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));
        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(bidder));
        when(bidRepository.save(any(Bid.class))).thenAnswer(i -> {
            Bid b = i.getArgument(0);
            b.setId(100L);
            return b;
        });

        BidResponse response = bidService.placeBid(10L, request, "bob@example.com");

        assertNotNull(response);
        assertEquals(BigDecimal.valueOf(550), response.getAmount());
        assertEquals(BigDecimal.valueOf(550), auction.getCurrentPrice());
        assertEquals(bidder, auction.getHighestBidder());
        assertEquals(1, auction.getBidCount());
        verify(messagingTemplate).convertAndSend(eq("/topic/auction/10"), any(Object.class));
    }

    @Test
    void placeBid_SellerCannotBidOnOwnItem_ThrowsBadRequest() {
        PlaceBidRequest request = PlaceBidRequest.builder()
                .amount(BigDecimal.valueOf(600))
                .build();

        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));
        when(userRepository.findByEmail("seller@example.com")).thenReturn(Optional.of(seller));

        assertThrows(BadRequestException.class,
                () -> bidService.placeBid(10L, request, "seller@example.com"));
    }

    @Test
    void placeBid_BelowMinimumIncrement_ThrowsBadRequest() {
        PlaceBidRequest request = PlaceBidRequest.builder()
                .amount(BigDecimal.valueOf(520)) // needs at least 550
                .build();

        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));
        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(bidder));

        assertThrows(BadRequestException.class,
                () -> bidService.placeBid(10L, request, "bob@example.com"));
    }

    @Test
    void placeBid_AuctionClosed_ThrowsBadRequest() {
        auction.setStatus(AuctionStatus.CLOSED);
        PlaceBidRequest request = PlaceBidRequest.builder()
                .amount(BigDecimal.valueOf(600))
                .build();

        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));
        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(bidder));

        assertThrows(BadRequestException.class,
                () -> bidService.placeBid(10L, request, "bob@example.com"));
    }

    @Test
    void placeBid_AntiSnipingExtension_Triggered() {
        // Auction ending in 1 minute (within 2-minute threshold)
        LocalDateTime originalEnd = LocalDateTime.now().plusMinutes(1);
        auction.setEndTime(originalEnd);

        PlaceBidRequest request = PlaceBidRequest.builder()
                .amount(BigDecimal.valueOf(550))
                .build();

        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));
        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(bidder));
        when(bidRepository.save(any(Bid.class))).thenAnswer(i -> i.getArgument(0));

        bidService.placeBid(10L, request, "bob@example.com");

        assertTrue(auction.getEndTime().isAfter(originalEnd));
    }
}
