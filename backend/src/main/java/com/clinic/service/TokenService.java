package com.clinic.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {

    private final Map<String, TokenInfo> tokens = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();
    private final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();

    // Token expiration time in seconds (24 hours)
    private static final long TOKEN_EXPIRATION_SECONDS = 86400;

    public String generateToken(UUID userId, String role) {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String token = base64Encoder.encodeToString(randomBytes);

        TokenInfo tokenInfo = new TokenInfo(userId, role, Instant.now().plusSeconds(TOKEN_EXPIRATION_SECONDS));
        tokens.put(token, tokenInfo);

        return token;
    }

    public boolean validateToken(String token) {
        TokenInfo info = tokens.get(token);
        if (info == null) {
            return false;
        }
        if (Instant.now().isAfter(info.expiresAt())) {
            tokens.remove(token);
            return false;
        }
        return true;
    }

    public UUID getUserIdFromToken(String token) {
        TokenInfo info = tokens.get(token);
        return info != null ? info.userId() : null;
    }

    public String getRoleFromToken(String token) {
        TokenInfo info = tokens.get(token);
        return info != null ? info.role() : null;
    }

    public void revokeToken(String token) {
        tokens.remove(token);
    }

    public void revokeAllUserTokens(UUID userId) {
        tokens.entrySet().removeIf(entry -> entry.getValue().userId().equals(userId));
    }

    public String refreshToken(String oldToken) {
        TokenInfo info = tokens.get(oldToken);
        if (info == null || Instant.now().isAfter(info.expiresAt())) {
            return null;
        }

        tokens.remove(oldToken);
        return generateToken(info.userId(), info.role());
    }

    // Token info record
    private record TokenInfo(UUID userId, String role, Instant expiresAt) {
    }
}
