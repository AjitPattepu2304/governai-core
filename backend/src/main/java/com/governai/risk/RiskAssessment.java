package com.governai.risk;

import com.governai.aisystem.AIApplication;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "risk_assessments")
public class RiskAssessment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_application_id", nullable = false)
    private AIApplication aiApplication;
    @Column(name = "privacy_score", nullable = false) private int privacyScore;
    @Column(name = "security_score", nullable = false) private int securityScore;
    @Column(name = "fairness_score", nullable = false) private int fairnessScore;
    @Column(name = "transparency_score", nullable = false) private int transparencyScore;
    @Column(name = "regulatory_score", nullable = false) private int regulatoryScore;
    @Column(name = "overall_score", nullable = false) private double overallScore;
    @Enumerated(EnumType.STRING) @Column(name = "risk_level", nullable = false) private AssessmentRiskLevel riskLevel;
    @Column(nullable = false) private Instant createdAt;

    protected RiskAssessment() {}
    public RiskAssessment(AIApplication app, int privacy, int security, int fairness, int transparency, int regulatory) {
        this.aiApplication = app; this.privacyScore = privacy; this.securityScore = security; this.fairnessScore = fairness;
        this.transparencyScore = transparency; this.regulatoryScore = regulatory; this.overallScore = (privacy + security + fairness + transparency + regulatory) / 5.0;
        this.riskLevel = AssessmentRiskLevel.fromScore(this.overallScore); this.createdAt = Instant.now();
    }
    public Long getId(){return id;} public AIApplication getAiApplication(){return aiApplication;} public int getPrivacyScore(){return privacyScore;}
    public int getSecurityScore(){return securityScore;} public int getFairnessScore(){return fairnessScore;} public int getTransparencyScore(){return transparencyScore;}
    public int getRegulatoryScore(){return regulatoryScore;} public double getOverallScore(){return overallScore;} public AssessmentRiskLevel getRiskLevel(){return riskLevel;} public Instant getCreatedAt(){return createdAt;}
}

enum AssessmentRiskLevel { LOW, MEDIUM, HIGH, CRITICAL;
    static AssessmentRiskLevel fromScore(double score) { if(score >= 80) return CRITICAL; if(score >= 60) return HIGH; if(score >= 30) return MEDIUM; return LOW; }
}
