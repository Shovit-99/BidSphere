package com.bidsphere.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionResponse {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String condition;
    private String categoryName;
    private Long categoryId;
    private Long sellerId;
    private String sellerName;
    private BigDecimal startingPrice;
    private BigDecimal currentPrice;
    private BigDecimal minIncrement;
    private String highestBidderName;
    private Long highestBidderId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private int bidCount;
    private LocalDateTime createdAt;
}
