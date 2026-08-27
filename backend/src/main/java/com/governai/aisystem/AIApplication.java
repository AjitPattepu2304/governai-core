package com.governai.aisystem;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ai_applications")
public class AIApplication {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false, length = 2000) private String purpose;
    @Column(nullable = false) private String owner;
    @Column(name = "business_unit", nullable = false) private String businessUnit;
    @Enumerated(EnumType.STRING) @Column(name = "risk_level", nullable = false) private RiskLevel riskLevel;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private ApplicationStatus status;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected AIApplication() {}

    public AIApplication(String name, String purpose, String owner, String businessUnit, RiskLevel riskLevel) {
        this.name = name; this.purpose = purpose; this.owner = owner; this.businessUnit = businessUnit;
        this.riskLevel = riskLevel; this.status = ApplicationStatus.ACTIVE; this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPurpose() { return purpose; }
    public String getOwner() { return owner; }
    public String getBusinessUnit() { return businessUnit; }
    public RiskLevel getRiskLevel() { return riskLevel; }
    public ApplicationStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}

enum RiskLevel { LOW, MEDIUM, HIGH, CRITICAL }
enum ApplicationStatus { ACTIVE, INACTIVE }
