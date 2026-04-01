package com.pos.backend.service;

import com.pos.backend.dto.ItemDto;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

public interface ItemService {
    ItemDto createItem(String name, String description, BigDecimal price, Long categoryId, MultipartFile file);
    List<ItemDto> getAllItems();
    void deleteItem(Long id);
}
