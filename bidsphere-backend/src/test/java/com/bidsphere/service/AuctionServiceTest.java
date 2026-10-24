package com.bidsphere.service;

import com.bidsphere.dto.request.CreateAuctionRequest;
import com.bidsphere.dto.response.AuctionResponse;
import com.bidsphere.entity.*;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.entity.enums.Role;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.*;
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
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuctionServiceTest {

    @Mock
    private AuctionRepository auctionRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BidRepository bidRepository;

    @InjectMocks
    private AuctionService auctionService;

    private User seller;
    private Category category;
    private Item item;
    private Auction auction;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(auctionService, "uploadDir", "./uploads");

        seller = User.builder()
                .id(1L)
                .name("Alice Seller")
                .email("seller@example.com")
                .role(Role.ROLE_SELLER)
                .build();

        category = Category.builder()
                .id(1L)
                .name("Electronics")
                .description("Gadgets")
                .build();

        item = Item.builder()
                .id(1L)
                .title("Vintage Camera")
                .description("Great condition")
                .category(category)
                .seller(seller)
                .condition("Used - Excellent")
                .build();

        auction = Auction.builder()
                .id(1L)
                .item(item)
                .startingPrice(BigDecimal.valueOf(100))
                .currentPrice(BigDecimal.valueOf(100))
                .minIncrement(BigDecimal.valueOf(10))
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusDays(2))
                .status(AuctionStatus.ACTIVE)
                .bidCount(0)
                .build();
    }

    @Test
    void createAuction_Success() {
        CreateAuctionRequest request = CreateAuctionRequest.builder()
                .title("Vintage Camera")
                .description("Great condition")
                .categoryId(1L)
                .startingPrice(BigDecimal.valueOf(100))
                .minIncrement(BigDecimal.valueOf(10))
                .endTime(LocalDateTime.now().plusDays(2))
                .condition("Used - Excellent")
                .build();

        when(userRepository.findByEmail("seller@example.com")).thenReturn(Optional.of(seller));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(itemRepository.save(any(Item.class))).thenReturn(item);
        when(auctionRepository.save(any(Auction.class))).thenReturn(auction);

        AuctionResponse response = auctionService.createAuction(request, "seller@example.com", null);

        assertNotNull(response);
        assertEquals("Vintage Camera", response.getTitle());
        assertEquals(BigDecimal.valueOf(100), response.getStartingPrice());
        verify(auctionRepository).save(any(Auction.class));
    }

    @Test
    void createAuction_PastEndTime_ThrowsBadRequest() {
        CreateAuctionRequest request = CreateAuctionRequest.builder()
                .title("Vintage Camera")
                .categoryId(1L)
                .startingPrice(BigDecimal.valueOf(100))
                .minIncrement(BigDecimal.valueOf(10))
                .endTime(LocalDateTime.now().minusHours(1))
                .build();

        when(userRepository.findByEmail("seller@example.com")).thenReturn(Optional.of(seller));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        assertThrows(BadRequestException.class,
                () -> auctionService.createAuction(request, "seller@example.com", null));
    }

    @Test
    void getAuction_Found() {
        when(auctionRepository.findById(1L)).thenReturn(Optional.of(auction));

        AuctionResponse response = auctionService.getAuction(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Vintage Camera", response.getTitle());
    }

    @Test
    void getAuction_NotFound_ThrowsException() {
        when(auctionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> auctionService.getAuction(99L));
    }

    @Test
    void getActiveAuctions_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Auction> page = new PageImpl<>(List.of(auction));
        when(auctionRepository.findByStatus(AuctionStatus.ACTIVE, pageable)).thenReturn(page);

        Page<AuctionResponse> responses = auctionService.getActiveAuctions(pageable);

        assertEquals(1, responses.getTotalElements());
        assertEquals("Vintage Camera", responses.getContent().get(0).getTitle());
    }

    @Test
    void cancelAuction_BySeller_Success() {
        when(auctionRepository.findById(1L)).thenReturn(Optional.of(auction));
        when(userRepository.findByEmail("seller@example.com")).thenReturn(Optional.of(seller));

        auctionService.cancelAuction(1L, "seller@example.com");

        assertEquals(AuctionStatus.CANCELLED, auction.getStatus());
        verify(auctionRepository).save(auction);
    }
}
