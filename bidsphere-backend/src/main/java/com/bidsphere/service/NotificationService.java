package com.bidsphere.service;

import com.bidsphere.dto.response.NotificationResponse;
import com.bidsphere.entity.Auction;
import com.bidsphere.entity.Notification;
import com.bidsphere.entity.User;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.NotificationRepository;
import com.bidsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    /**
     * Notify a user they have been outbid.
     */
    @Async
    public void notifyOutbid(User user, Auction auction) {
        String message = String.format("You have been outbid on \"%s\"! Current price: %s",
                auction.getItem().getTitle(), auction.getCurrentPrice());

        saveNotification(user, message, "OUTBID", auction.getId());
        sendEmail(user.getEmail(), "You've been outbid! - BidSphere", message);
    }

    /**
     * Notify the winner of an auction.
     */
    @Async
    public void notifyWinner(User winner, Auction auction) {
        String message = String.format("Congratulations! You won the auction for \"%s\" at %s!",
                auction.getItem().getTitle(), auction.getCurrentPrice());

        saveNotification(winner, message, "WON", auction.getId());
        sendEmail(winner.getEmail(), "You won an auction! - BidSphere", message);
    }

    /**
     * Notify the seller that their auction has ended.
     */
    @Async
    public void notifySellerAuctionEnded(User seller, Auction auction, boolean hasBids) {
        String message;
        if (hasBids) {
            message = String.format("Your auction \"%s\" has ended. Final price: %s",
                    auction.getItem().getTitle(), auction.getCurrentPrice());
        } else {
            message = String.format("Your auction \"%s\" ended with no bids.",
                    auction.getItem().getTitle());
        }

        saveNotification(seller, message, "AUCTION_ENDED", auction.getId());
        sendEmail(seller.getEmail(), "Auction Ended - BidSphere", message);
    }

    /**
     * Get paginated notifications for the logged in user.
     */
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get unread notification count for a user by email.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    /**
     * Get unread notification count for a user by ID.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    /**
     * Mark a single notification as read.
     */
    @Transactional
    public NotificationResponse markAsRead(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("You can only modify your own notifications");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        return mapToResponse(notification);
    }

    /**
     * Mark all notifications as read for the user.
     */
    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationRepository.markAllAsReadForUser(user.getId());
    }

    /**
     * Delete a notification.
     */
    @Transactional
    public void deleteNotification(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("You can only delete your own notifications");
        }

        notificationRepository.delete(notification);
    }

    private void saveNotification(User user, String message, String type, Long referenceId) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .read(false)
                .build();
        notificationRepository.save(notification);
        log.info("Notification saved for user {}: {}", user.getEmail(), type);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(body);
            mail.setFrom("noreply@bidsphere.com");
            mailSender.send(mail);
            log.info("Email sent to {}: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    public NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
