package com.bidsphere.service;

import com.bidsphere.dto.request.PaymentRequest;
import com.bidsphere.dto.response.PaymentResponse;
import com.bidsphere.entity.*;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.entity.enums.PaymentStatus;
import com.bidsphere.entity.enums.Role;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.PaymentRepository;
import com.bidsphere.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private AuctionRepository auctionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PaymentService paymentService;

    private User winner;
    private User seller;
    private Auction auction;
    private Item item;

    @BeforeEach
    void setUp() {
        winner = User.builder()
                .id(1L)
                .name("Winner User")
                .email("winner@example.com")
                .role(Role.ROLE_BIDDER)
                .build();

        seller = User.builder()
                .id(2L)
                .name("Seller User")
                .email("seller@example.com")
                .role(Role.ROLE_SELLER)
                .build();

        item = Item.builder()
                .id(1L)
                .title("Gold Coin")
                .seller(seller)
                .build();

        auction = Auction.builder()
                .id(10L)
                .item(item)
                .currentPrice(BigDecimal.valueOf(1500))
                .highestBidder(winner)
                .status(AuctionStatus.CLOSED)
                .build();
    }

    @Test
    void processPayment_Success() {
        PaymentRequest request = PaymentRequest.builder()
                .paymentMethod("CREDIT_CARD")
                .build();

        when(userRepository.findByEmail("winner@example.com")).thenReturn(Optional.of(winner));
        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));
        when(paymentRepository.findByAuctionId(10L)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(i -> {
            Payment p = i.getArgument(0);
            p.setId(50L);
            return p;
        });

        PaymentResponse response = paymentService.processPayment(10L, request, "winner@example.com");

        assertNotNull(response);
        assertEquals(BigDecimal.valueOf(1500), response.getAmount());
        assertEquals("COMPLETED", response.getStatus());
        assertEquals("CREDIT_CARD", response.getPaymentMethod());
        assertNotNull(response.getTransactionRef());
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void processPayment_AuctionNotClosed_ThrowsBadRequest() {
        auction.setStatus(AuctionStatus.ACTIVE);
        PaymentRequest request = PaymentRequest.builder().paymentMethod("CREDIT_CARD").build();

        when(userRepository.findByEmail("winner@example.com")).thenReturn(Optional.of(winner));
        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));

        assertThrows(BadRequestException.class,
                () -> paymentService.processPayment(10L, request, "winner@example.com"));
    }

    @Test
    void processPayment_NotWinner_ThrowsBadRequest() {
        User anotherUser = User.builder().id(99L).email("intruder@example.com").build();
        PaymentRequest request = PaymentRequest.builder().paymentMethod("CREDIT_CARD").build();

        when(userRepository.findByEmail("intruder@example.com")).thenReturn(Optional.of(anotherUser));
        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));

        assertThrows(BadRequestException.class,
                () -> paymentService.processPayment(10L, request, "intruder@example.com"));
    }

    @Test
    void processPayment_AlreadyCompleted_ThrowsBadRequest() {
        Payment completedPayment = Payment.builder()
                .id(1L)
                .auction(auction)
                .user(winner)
                .amount(BigDecimal.valueOf(1500))
                .status(PaymentStatus.COMPLETED)
                .build();

        PaymentRequest request = PaymentRequest.builder().paymentMethod("CREDIT_CARD").build();

        when(userRepository.findByEmail("winner@example.com")).thenReturn(Optional.of(winner));
        when(auctionRepository.findById(10L)).thenReturn(Optional.of(auction));
        when(paymentRepository.findByAuctionId(10L)).thenReturn(Optional.of(completedPayment));

        assertThrows(BadRequestException.class,
                () -> paymentService.processPayment(10L, request, "winner@example.com"));
    }
}
