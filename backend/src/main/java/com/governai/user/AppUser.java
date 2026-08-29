package com.governai.user;

import com.governai.organization.Organization;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "app_users")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false, unique = true) private String email;
    @Column(name = "password_hash", nullable = false) private String passwordHash;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "organization_id", nullable = false) private Organization organization;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private UserRole role;
    @Column(nullable = false) private Instant createdAt;

    protected AppUser() {}
    public AppUser(String name, String email, String passwordHash, Organization organization, UserRole role) { this.name=name; this.email=email; this.passwordHash=passwordHash; this.organization=organization; this.role=role; this.createdAt=Instant.now(); }
    public Long getId(){return id;} public String getName(){return name;} public String getEmail(){return email;} public String getPasswordHash(){return passwordHash;} public Organization getOrganization(){return organization;} public UserRole getRole(){return role;} public Instant getCreatedAt(){return createdAt;}
}
