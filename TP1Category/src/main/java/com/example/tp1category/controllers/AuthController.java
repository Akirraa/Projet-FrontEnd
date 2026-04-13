package com.example.tp1category.controllers;

import com.example.tp1category.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // POST /api/auth/signup  { "email": "user@example.com" }
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        try {
            Map<String, Object> result = authService.signup(body.get("email"));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/auth/login  { "email": "...", "password": "..." }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            Map<String, Object> result = authService.login(body.get("email"), body.get("password"));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/auth/logout  Header: Authorization: Bearer <token>
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        authService.logout(token);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
    }

    // POST /api/auth/change-password  { "currentPassword": "...", "newPassword": "..." }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String token = authHeader.replace("Bearer ", "");
            authService.changePassword(token, body.get("currentPassword"), body.get("newPassword"));
            return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/auth/me   Header: Authorization: Bearer <token>
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Map<String, Object> result = authService.me(token);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // ---- Super Admin: User Management ----

    // GET /api/auth/users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            // Verify caller is SUPER_ADMIN
            Map<String, Object> caller = authService.me(token);
            if (!"ROLE_SUPER_ADMIN".equals(caller.get("role"))) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied."));
            }
            List<Map<String, Object>> users = authService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/auth/users/{userId}/role  { "role": "ROLE_ADMIN" }
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Map<String, Object> caller = authService.me(token);
            if (!"ROLE_SUPER_ADMIN".equals(caller.get("role"))) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied."));
            }
            Map<String, Object> result = authService.updateUserRole(userId, body.get("role"));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/auth/users/{userId}
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long userId) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Map<String, Object> caller = authService.me(token);
            if (!"ROLE_SUPER_ADMIN".equals(caller.get("role"))) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied."));
            }
            authService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted."));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
