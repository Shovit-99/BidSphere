package com.bidsphere.service;

import com.bidsphere.dto.request.ChangePasswordRequest;
import com.bidsphere.dto.request.UpdateProfileRequest;
import com.bidsphere.dto.response.AuctionResponse;
import com.bidsphere.dto.response.UserProfileResponse;
import com.bidsphere.entity.User;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.AuctionRepository;
import com.bidsphere.repository.BidRepository;
import com.bidsphere.repository.UserRepository;
import com.bidsphere.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final WatchlistRepository watchlistRepository;
    private final AuctionService auctionService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return buildProfileResponse(user);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfileById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return buildProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String userEmail, UpdateProfileRequest request, MultipartFile avatar) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(request.getName());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (avatar != null && !avatar.isEmpty()) {
            user.setAvatarUrl(saveAvatar(avatar));
        }

        userRepository.save(user);
        log.info("User profile updated: {}", userEmail);
        return buildProfileResponse(user);
    }

    @Transactional
    public void changePassword(String userEmail, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password updated successfully for: {}", userEmail);
    }

    @Transactional(readOnly = true)
    public Page<AuctionResponse> getWonAuctions(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return auctionRepository.findByHighestBidderIdAndStatus(user.getId(), AuctionStatus.CLOSED, pageable)
                .map(auctionService::mapToResponse);
    }

    private UserProfileResponse buildProfileResponse(User user) {
        long totalBids = bidRepository.countByBidderId(user.getId());
        long totalWonAuctions = auctionRepository.countByHighestBidderIdAndStatus(user.getId(), AuctionStatus.CLOSED);
        long totalAuctionsCreated = auctionRepository.countBySellerId(user.getId());
        long totalWatchlistItems = watchlistRepository.countByUserId(user.getId());

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .avatarUrl(user.getAvatarUrl())
                .totalBids(totalBids)
                .totalWonAuctions(totalWonAuctions)
                .totalAuctionsCreated(totalAuctionsCreated)
                .totalWatchlistItems(totalWatchlistItems)
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String saveAvatar(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String filename = "avatar_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload avatar: " + e.getMessage());
        }
    }
}
