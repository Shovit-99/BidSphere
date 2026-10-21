package com.bidsphere.repository;

import com.bidsphere.entity.Auction;
import com.bidsphere.entity.enums.AuctionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long>, JpaSpecificationExecutor<Auction> {

    /**
     * Find auctions that need to be closed by the scheduler.
     */
    List<Auction> findByStatusAndEndTimeBefore(AuctionStatus status, LocalDateTime endTime);

    /**
     * Find auctions by seller (via item.seller).
     */
    @Query("SELECT a FROM Auction a JOIN a.item i WHERE i.seller.id = :sellerId")
    Page<Auction> findBySellerId(@Param("sellerId") Long sellerId, Pageable pageable);

    /**
     * Find active auctions ending soon (within a given time).
     */
    @Query("SELECT a FROM Auction a WHERE a.status = 'ACTIVE' AND a.endTime BETWEEN :now AND :deadline ORDER BY a.endTime ASC")
    List<Auction> findEndingSoon(@Param("now") LocalDateTime now, @Param("deadline") LocalDateTime deadline);

    /**
     * Search by keyword in item title or description.
     */
    @Query("SELECT a FROM Auction a JOIN a.item i WHERE a.status = :status AND " +
           "(LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Auction> searchByKeyword(@Param("status") AuctionStatus status,
                                  @Param("keyword") String keyword,
                                  Pageable pageable);

    /**
     * Find active auctions by category.
     */
    @Query("SELECT a FROM Auction a JOIN a.item i WHERE a.status = :status AND i.category.id = :categoryId")
    Page<Auction> findByStatusAndCategoryId(@Param("status") AuctionStatus status,
                                            @Param("categoryId") Long categoryId,
                                            Pageable pageable);

    Page<Auction> findByStatus(AuctionStatus status, Pageable pageable);

    long countByStatus(AuctionStatus status);
}
