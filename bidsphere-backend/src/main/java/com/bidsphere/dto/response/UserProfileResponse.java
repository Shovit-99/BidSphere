package com.bidsphere.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean enabled;
    private String avatarUrl;
    private long totalBids;
    private long totalWonAuctions;
    private long totalAuctionsCreated;
    private long totalWatchlistItems;
    private LocalDateTime createdAt;
}
