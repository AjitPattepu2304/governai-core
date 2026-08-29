package com.governai.organization;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "organizations")
public class Organization {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true) private String name;
    @Column(nullable = false, length = 2) private String countryCode;
    @Column(nullable = false) private Instant createdAt;

    protected Organization() {}
    public Organization(String name, String countryCode) { this.name = name; this.countryCode = countryCode; this.createdAt = Instant.now(); }
    public Long getId(){ return id; }
    public String getName(){ return name; }
    public String getCountryCode(){ return countryCode; }
    public Instant getCreatedAt(){ return createdAt; }
}
