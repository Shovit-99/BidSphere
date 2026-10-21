package com.bidsphere.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * WebSocket message payload broadcast after every bid.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionUpdateMessage {
    private Long auctionId;
    private BigDecimal currentPrice;
    private String highestBidderName;
    private LocalDateTime endTime;
    private int bidCount;
}
