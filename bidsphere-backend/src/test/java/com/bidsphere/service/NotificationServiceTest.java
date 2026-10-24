package com.bidsphere.service;

import com.bidsphere.dto.response.NotificationResponse;
import com.bidsphere.entity.Notification;
import com.bidsphere.entity.User;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.NotificationRepository;
import com.bidsphere.repository.UserRepository;
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
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private NotificationService notificationService;

    private User user;
    private Notification notification;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Test User")
                .email("user@example.com")
                .build();

        notification = Notification.builder()
                .id(10L)
                .user(user)
                .message("You won the auction!")
                .type("WON")
                .referenceId(100L)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getUserNotifications_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(notification)));

        Page<NotificationResponse> result = notificationService.getUserNotifications("user@example.com", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("You won the auction!", result.getContent().get(0).getMessage());
    }

    @Test
    void getUnreadCount_Success() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.countByUserIdAndReadFalse(1L)).thenReturn(3L);

        long count = notificationService.getUnreadCount("user@example.com");

        assertEquals(3L, count);
    }

    @Test
    void markAsRead_Success() {
        when(notificationRepository.findById(10L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        NotificationResponse response = notificationService.markAsRead(10L, "user@example.com");

        assertNotNull(response);
        assertTrue(notification.isRead());
        verify(notificationRepository).save(notification);
    }

    @Test
    void markAsRead_DifferentUser_ThrowsBadRequest() {
        when(notificationRepository.findById(10L)).thenReturn(Optional.of(notification));

        assertThrows(BadRequestException.class,
                () -> notificationService.markAsRead(10L, "other@example.com"));
    }

    @Test
    void markAllAsRead_Success() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        notificationService.markAllAsRead("user@example.com");

        verify(notificationRepository).markAllAsReadForUser(1L);
    }

    @Test
    void deleteNotification_Success() {
        when(notificationRepository.findById(10L)).thenReturn(Optional.of(notification));

        notificationService.deleteNotification(10L, "user@example.com");

        verify(notificationRepository).delete(notification);
    }
}
