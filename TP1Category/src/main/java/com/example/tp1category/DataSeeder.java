package com.example.tp1category;

import com.example.tp1category.entities.Role;
import com.example.tp1category.entities.User;
import com.example.tp1category.repositories.RoleRepository;
import com.example.tp1category.repositories.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.HashSet;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(RoleRepository roleRepository, UserRepository userRepository) {
        return args -> {
            // Seed roles if not present
            seedRole(roleRepository, "ROLE_CLIENT");
            seedRole(roleRepository, "ROLE_ADMIN");
            seedRole(roleRepository, "ROLE_SUPER_ADMIN");

            // Seed default super admin if not present
            if (userRepository.findByEmail("superadmin@admin.com").isEmpty()) {
                Role superAdminRole = roleRepository.findByName("ROLE_SUPER_ADMIN").orElseThrow();
                User superAdmin = new User();
                superAdmin.setEmail("superadmin@admin.com");
                // Default password: SuperAdmin123! - CHANGE IN PRODUCTION
                superAdmin.setPasswordHash(BCrypt.hashpw("SuperAdmin123!", BCrypt.gensalt(12)));
                superAdmin.setRoles(new HashSet<>(Collections.singleton(superAdminRole)));
                userRepository.save(superAdmin);
                System.out.println("=================================================");
                System.out.println("Default Super Admin created:");
                System.out.println("  Email:    superadmin@admin.com");
                System.out.println("  Password: SuperAdmin123!");
                System.out.println("  CHANGE THIS PASSWORD IMMEDIATELY!");
                System.out.println("=================================================");
            }
        };
    }

    private void seedRole(RoleRepository repo, String name) {
        if (repo.findByName(name).isEmpty()) {
            repo.save(new Role(name));
            System.out.println("Seeded role: " + name);
        }
    }
}
