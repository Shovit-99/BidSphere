package com.bidsphere.service;

import com.bidsphere.dto.request.ChangePasswordRequest;
import com.bidsphere.dto.request.UpdateProfileRequest;
import com.bidsphere.dto.response.UserProfileResponse;
import com.bidsphere.entity.User;
import com.bidsphere.entity.enums.Role;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.BidRepository;
import com.bidsphere.repository.UserRepository;
import com.bidsphere.repository.WatchlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BidRepository bidRepository;

    @Mock
    private AuctionRepository auctionRepository;

    @Mock
    private WatchlistRepository watchlistRepository;

    @Mock
    private AuctionService auctionService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(userService, "uploadDir", "./uploads");

        user = User.builder()
                .id(1L)
                .name("Alex Smith")
                .email("alex@example.com")
                .phone("1234567890")
                .password("encoded_secret")
                .role(Role.ROLE_BIDDER)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getCurrentUserProfile_Success() {
        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(user));
        when(bidRepository.countByBidderId(1L)).thenReturn(5L);
        when(auctionRepository.countByHighestBidderIdAndStatus(eq(1L), any())).thenReturn(2L);
        when(auctionRepository.countBySellerId(1L)).thenReturn(1L);
        when(watchlistRepository.countByUserId(1L)).thenReturn(3L);

        UserProfileResponse profile = userService.getCurrentUserProfile("alex@example.com");

        assertNotNull(profile);
        assertEquals("Alex Smith", profile.getName());
        assertEquals("alex@example.com", profile.getEmail());
        assertEquals(5L, profile.getTotalBids());
        assertEquals(2L, profile.getTotalWonAuctions());
        assertEquals(1L, profile.getTotalAuctionsCreated());
        assertEquals(3L, profile.getTotalWatchlistItems());
    }

    @Test
    void updateProfile_Success() {
        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .name("Alex Updated")
                .phone("9876543210")
                .build();

        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserProfileResponse response = userService.updateProfile("alex@example.com", request, null);

        assertNotNull(response);
        assertEquals("Alex Updated", user.getName());
        assertEquals("9876543210", user.getPhone());
    }

    @Test
    void changePassword_Success() {
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("old_pass")
                .newPassword("brand_new_pass")
                .build();

        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old_pass", "encoded_secret")).thenReturn(true);
        when(passwordEncoder.encode("brand_new_pass")).thenReturn("encoded_new");

        userService.changePassword("alex@example.com", request);

        assertEquals("encoded_new", user.getPassword());
        verify(userRepository).save(user);
    }

    @Test
    void changePassword_WrongCurrentPassword_ThrowsBadRequest() {
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("wrong_pass")
                .newPassword("brand_new_pass")
                .build();

        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong_pass", "encoded_secret")).thenReturn(false);

        assertThrows(BadRequestException.class,
                () -> userService.changePassword("alex@example.com", request));
        verify(userRepository, never()).save(any(User.class));
    }
}
