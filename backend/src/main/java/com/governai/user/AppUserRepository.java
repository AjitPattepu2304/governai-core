package com.governai.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    @Query("""
        SELECT u
        FROM AppUser u
        JOIN FETCH u.organization
        WHERE LOWER(u.email) = LOWER(:email)
    """)
    Optional<AppUser> findByEmailIgnoreCase(String email);

    @Query("""
        SELECT u
        FROM AppUser u
        JOIN FETCH u.organization
        WHERE u.id = :id
    """)
    Optional<AppUser> findByIdWithOrganization(Long id);

    boolean existsByEmailIgnoreCase(String email);
}