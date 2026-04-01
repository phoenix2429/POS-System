package com.pos.backend.service;

import com.pos.backend.dto.AuthRequest;
import com.pos.backend.dto.AuthResponse;

public interface AuthService {
    AuthResponse login(AuthRequest request);
}
