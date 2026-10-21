package com.bidsphere.repository;

import com.bidsphere.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    Page<Item> findBySellerId(Long sellerId, Pageable pageable);

    Page<Item> findByCategoryId(Long categoryId, Pageable pageable);
}
