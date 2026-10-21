package com.bidsphere.service;

import com.bidsphere.dto.request.CreateAuctionRequest;
import com.bidsphere.dto.response.AuctionResponse;
import com.bidsphere.entity.*;
import com.bidsphere.entity.enums.AuctionStatus;
import com.bidsphere.exception.BadRequestException;
import com.bidsphere.exception.ResourceNotFoundException;
import com.bidsphere.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final BidRepository bidRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public AuctionResponse createAuction(CreateAuctionRequest request, String sellerEmail, MultipartFile image) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (request.getEndTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("End time must be in the future");
        }

        if (request.getStartingPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Starting price must be greater than 0");
        }

        // Save image if provided
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = saveImage(image);
        }

        // Create item
        Item item = Item.builder()
                .seller(seller)
                .category(category)
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(imageUrl)
                .condition(request.getCondition())
                .build();
        itemRepository.save(item);

        // Create auction
        Auction auction = Auction.builder()
                .item(item)
                .startingPrice(request.getStartingPrice())
                .currentPrice(request.getStartingPrice())
                .minIncrement(request.getMinIncrement())
                .startTime(LocalDateTime.now())
                .endTime(request.getEndTime())
                .status(AuctionStatus.ACTIVE)
                .bidCount(0)
                .build();
        auctionRepository.save(auction);

        log.info("Auction created: id={}, title={}, by seller={}", auction.getId(), item.getTitle(), sellerEmail);
        return mapToResponse(auction);
    }

    @Transactional(readOnly = true)
    public AuctionResponse getAuction(Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with id: " + id));
        return mapToResponse(auction);
    }

    @Transactional(readOnly = true)
    public Page<AuctionResponse> getActiveAuctions(Pageable pageable) {
        return auctionRepository.findByStatus(AuctionStatus.ACTIVE, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<AuctionResponse> searchAuctions(String keyword, Pageable pageable) {
        return auctionRepository.searchByKeyword(AuctionStatus.ACTIVE, keyword, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<AuctionResponse> getAuctionsByCategory(Long categoryId, Pageable pageable) {
        return auctionRepository.findByStatusAndCategoryId(AuctionStatus.ACTIVE, categoryId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<AuctionResponse> getMyAuctions(String sellerEmail, Pageable pageable) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        return auctionRepository.findBySellerId(seller.getId(), pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public AuctionResponse updateAuction(Long id, CreateAuctionRequest request, String sellerEmail, MultipartFile image) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));

        if (!auction.getItem().getSeller().getEmail().equals(sellerEmail)) {
            throw new BadRequestException("You can only edit your own auctions");
        }

        if (bidRepository.existsByAuctionId(id)) {
            throw new BadRequestException("Cannot edit an auction that already has bids");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Item item = auction.getItem();
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(category);
        item.setCondition(request.getCondition());

        if (image != null && !image.isEmpty()) {
            item.setImageUrl(saveImage(image));
        }

        auction.setStartingPrice(request.getStartingPrice());
        auction.setCurrentPrice(request.getStartingPrice());
        auction.setMinIncrement(request.getMinIncrement());
        auction.setEndTime(request.getEndTime());

        auctionRepository.save(auction);
        log.info("Auction updated: id={}", id);
        return mapToResponse(auction);
    }

    @Transactional
    public void cancelAuction(Long id, String userEmail) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isSeller = auction.getItem().getSeller().getId().equals(user.getId());
        boolean isAdmin = user.getRole().name().equals("ROLE_ADMIN");

        if (!isSeller && !isAdmin) {
            throw new BadRequestException("Only the seller or an admin can cancel this auction");
        }

        auction.setStatus(AuctionStatus.CANCELLED);
        auctionRepository.save(auction);
        log.info("Auction cancelled: id={} by user={}", id, userEmail);
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload image: " + e.getMessage());
        }
    }

    public AuctionResponse mapToResponse(Auction auction) {
        Item item = auction.getItem();
        return AuctionResponse.builder()
                .id(auction.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .imageUrl(item.getImageUrl())
                .condition(item.getCondition())
                .categoryName(item.getCategory().getName())
                .categoryId(item.getCategory().getId())
                .sellerId(item.getSeller().getId())
                .sellerName(item.getSeller().getName())
                .startingPrice(auction.getStartingPrice())
                .currentPrice(auction.getCurrentPrice())
                .minIncrement(auction.getMinIncrement())
                .highestBidderName(auction.getHighestBidder() != null ? auction.getHighestBidder().getName() : null)
                .highestBidderId(auction.getHighestBidder() != null ? auction.getHighestBidder().getId() : null)
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .status(auction.getStatus().name())
                .bidCount(auction.getBidCount())
                .createdAt(auction.getCreatedAt())
                .build();
    }
}
