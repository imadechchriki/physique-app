package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    // Basic queries
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndIsActiveTrueAndIsDeletedFalse(String email);
    // Find user by ID excluding soft-deleted
    Optional<User> findByIdAndIsDeletedFalse(UUID id);
    boolean existsByEmail(String email);
    // Pagination methods for admin
    Page<User> findByIsDeletedFalse(Pageable pageable);

    // Find users by role
    Page<User> findByRoleAndIsDeletedFalse(UserRole role, Pageable pageable);
    // Role-based queries
    List<User> findByRole(UserRole role);
    // Count methods for statistics
    long countByRoleAndIsDeletedFalse(UserRole role);
    long countByRoleAndIsActiveTrueAndIsDeletedFalse(UserRole role);
    long countByRoleAndIsActiveFalseAndIsDeletedFalse(UserRole role);


    // Search queries
    @Query("SELECT u FROM User u WHERE " +
            "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "u.isDeleted = false")
    Page<User> findBySearchTerm(@Param("search") String search, Pageable pageable);

    // Active users
    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.isDeleted = false")
    Page<User> findActiveUsers(Pageable pageable);

    // Account management
    @Query("SELECT u FROM User u WHERE u.resetToken = :token AND u.resetTokenExpiry > :now")
    Optional<User> findByValidResetToken(@Param("token") String token, @Param("now") LocalDateTime now);

    @Query("SELECT u FROM User u WHERE u.emailVerificationToken = :token")
    Optional<User> findByEmailVerificationToken(@Param("token") String token);

    // Statistics queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isDeleted = false")
    long countByRole(@Param("role") UserRole role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate AND u.isDeleted = false")
    long countUsersCreatedAfter(@Param("startDate") LocalDateTime startDate);

    // Update queries
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginTime WHERE u.id = :userId")
    void updateLastLoginTime(@Param("userId") UUID userId, @Param("loginTime") LocalDateTime loginTime);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = :attempts WHERE u.id = :userId")
    void updateFailedLoginAttempts(@Param("userId") UUID userId, @Param("attempts") Integer attempts);

    @Modifying
    @Query("UPDATE User u SET u.accountLockedUntil = :lockUntil WHERE u.id = :userId")
    void lockUserAccount(@Param("userId") UUID userId, @Param("lockUntil") LocalDateTime lockUntil);
}