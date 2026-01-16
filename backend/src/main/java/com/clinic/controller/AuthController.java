package com.clinic.controller;

import com.clinic.model.User;
import com.clinic.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userRepository.findByEmail(request.email)
                .map(user -> {
                    // Simple password check (in production, use BCrypt)
                    if (user.getPassword().equals(request.password)) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("user", Map.of(
                                "id", user.getId(),
                                "email", user.getEmail(),
                                "name", user.getName(),
                                "role", user.getRole()));
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.status(401).body(Map.of(
                                "success", false,
                                "message", "Invalid password"));
                    }
                })
                .orElse(ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "User not found")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email already exists"));
        }

        User user = new User();
        user.setEmail(request.email);
        user.setPassword(request.password); // In production, hash with BCrypt
        user.setName(request.name);
        user.setRole(request.role != null ? request.role : "RECEPTIONIST");

        User saved = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "user", Map.of(
                        "id", saved.getId(),
                        "email", saved.getEmail(),
                        "name", saved.getName(),
                        "role", saved.getRole())));
    }

    // DTO classes
    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class RegisterRequest {
        public String email;
        public String password;
        public String name;
        public String role;
    }
}
