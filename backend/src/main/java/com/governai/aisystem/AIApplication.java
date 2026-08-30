package com.governai.aisystem;

import com.governai.organization.Organization;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "ai_applications")
public class AIApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, length = 2000)
    private String purpose;
    @Column(nullable = false)
    private String owner;
    @Column(name = "business_unit", nullable = false)
    private String businessUnit;
    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private RiskLevel riskLevel;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ai_application_countries", joinColumns = @JoinColumn(name = "ai_application_id"))
    @Column(name = "country_code", nullable = false, length = 2)
    @Enumerated(EnumType.STRING)
    private Set<CountryCode> countries = new LinkedHashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "ai_type", nullable = false)
    private AIType aiType;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Lifecycle lifecycle;
    @Enumerated(EnumType.STRING)
    @Column(name = "decision_impact", nullable = false)
    private DecisionImpact decisionImpact;
    @Enumerated(EnumType.STRING)
    @Column(name = "human_oversight", nullable = false)
    private HumanOversight humanOversight;
    @Column(name = "personal_data", nullable = false)
    private boolean personalData;
    @Column(name = "sensitive_data", nullable = false)
    private boolean sensitiveData;
    @Column(name = "external_ai_provider", nullable = false)
    private boolean externalAiProvider;

    protected AIApplication() {
    }

    public AIApplication(String name, String purpose, String owner, String businessUnit, RiskLevel riskLevel,
                         Organization organization, Set<CountryCode> countries, AIType aiType, Lifecycle lifecycle,
                         DecisionImpact decisionImpact, HumanOversight humanOversight,
                         boolean personalData, boolean sensitiveData, boolean externalAiProvider) {
        this.name = name;
        this.purpose = purpose;
        this.owner = owner;
        this.businessUnit = businessUnit;
        this.riskLevel = riskLevel;
        this.organization = organization;
        this.status = ApplicationStatus.ACTIVE;
        this.createdAt = Instant.now();
        this.countries = new LinkedHashSet<>(countries);
        this.aiType = aiType;
        this.lifecycle = lifecycle;
        this.decisionImpact = decisionImpact;
        this.humanOversight = humanOversight;
        this.personalData = personalData;
        this.sensitiveData = sensitiveData;
        this.externalAiProvider = externalAiProvider;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPurpose() {
        return purpose;
    }

    public String getOwner() {
        return owner;
    }

    public String getBusinessUnit() {
        return businessUnit;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Organization getOrganization() {
        return organization;
    }

    public Set<CountryCode> getCountries() {
        return countries;
    }

    public AIType getAiType() {
        return aiType;
    }

    public Lifecycle getLifecycle() {
        return lifecycle;
    }

    public DecisionImpact getDecisionImpact() {
        return decisionImpact;
    }

    public HumanOversight getHumanOversight() {
        return humanOversight;
    }

    public boolean isPersonalData() {
        return personalData;
    }

    public boolean isSensitiveData() {
        return sensitiveData;
    }

    public boolean isExternalAiProvider() {
        return externalAiProvider;
    }
}
