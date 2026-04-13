package com.example.tp1category.services;

import com.example.tp1category.entities.Role;
import com.example.tp1category.entities.User;
import com.example.tp1category.repositories.RoleRepository;
import com.example.tp1category.repositories.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.*;
import java.util.logging.Logger;

@Service
public class AuthService {

    private static final Logger log = Logger.getLogger(AuthService.class.getName());
    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    // Generate a strong random password
    private String generatePassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    // Sign up: create user with CLIENT role by default, email them their password
    public Map<String, Object> signup(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered.");
        }

        String rawPassword = generatePassword(14);
        String hashed = BCrypt.hashpw(rawPassword, BCrypt.gensalt(12));

        Role clientRole = roleRepository.findByName("ROLE_CLIENT")
                .orElseThrow(() -> new RuntimeException("Default role not found. Please seed the database."));

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(hashed);
        user.setRoles(new HashSet<>(Collections.singleton(clientRole)));
        userRepository.save(user);

        // Send email notification
        boolean emailSent = false;
        if (fromEmail == null || fromEmail.isBlank()) {
            log.warning("[MAIL] MAIL_USERNAME env var is not set. Email will NOT be sent.");
        } else {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(email);
                message.setSubject("Welcome! Your temporary password");
                message.setText(
                    "Hello,\n\n" +
                    "Your account has been created successfully.\n\n" +
                    "Your temporary password: " + rawPassword + "\n\n" +
                    "Please log in and change your password immediately after your first login.\n\n" +
                    "Best regards,\nThe AdminHub Team"
                );
                mailSender.send(message);
                emailSent = true;
                log.info("[MAIL] Welcome email sent successfully to: " + email);
            } catch (Exception e) {
                // Don't fail signup just because email failed — password is shown on screen
                log.severe("[MAIL] Failed to send welcome email to " + email + ": " + e.getMessage());
                log.severe("[MAIL] Cause: " + (e.getCause() != null ? e.getCause().getMessage() : "unknown"));
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Account created successfully.");
        result.put("email", email);
        result.put("generatedPassword", rawPassword); // shown once on screen
        result.put("emailSent", emailSent);
        return result;
    }

    // Login: verify credentials, create session token, return user info + role
    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (!BCrypt.checkpw(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password.");
        }

        // Generate a new session token on each login
        String token = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        user.setSessionToken(token);
        userRepository.save(user);

        String role = user.getRoles().stream()
                .findFirst()
                .map(Role::getName)
                .orElse("ROLE_CLIENT");

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("email", user.getEmail());
        result.put("userId", user.getId());
        result.put("role", role);
        return result;
    }

    // Logout: clear session token
    public void logout(String token) {
        userRepository.findBySessionToken(token).ifPresent(user -> {
            user.setSessionToken(null);
            userRepository.save(user);
        });
    }

    // Change password using session token
    public void changePassword(String token, String currentPassword, String newPassword) {
        User user = userRepository.findBySessionToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid session. Please log in again."));

        if (!BCrypt.checkpw(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        user.setPasswordHash(BCrypt.hashpw(newPassword, BCrypt.gensalt(12)));
        userRepository.save(user);
    }

    // Get current user from token (for route guards)
    public Map<String, Object> me(String token) {
        User user = userRepository.findBySessionToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired session."));

        String role = user.getRoles().stream()
                .findFirst()
                .map(Role::getName)
                .orElse("ROLE_CLIENT");

        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.getId());
        result.put("email", user.getEmail());
        result.put("role", role);
        return result;
    }

    // ---- Super Admin: User Management ----

    public List<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("role", u.getRoles().stream().findFirst().map(Role::getName).orElse("NONE"));
            result.add(map);
        }
        return result;
    }

    public Map<String, Object> updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        // Enforce single role
        user.setRoles(new HashSet<>(Collections.singleton(role)));
        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Role updated successfully.");
        result.put("userId", userId);
        result.put("newRole", roleName);
        return result;
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
