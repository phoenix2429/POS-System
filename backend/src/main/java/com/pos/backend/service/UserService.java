package com.pos.backend.service;

import com.pos.backend.dto.UserDto;
import java.util.List;

public interface UserService {
    UserDto createUser(UserDto userDto);
    List<UserDto> getAllUsers();
    void deleteUser(Long id);
}
