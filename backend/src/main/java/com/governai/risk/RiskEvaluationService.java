package com.governai.risk;

import com.governai.aisystem.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class RiskEvaluationService {

    private static final Logger log = LoggerFactory.getLogger(RiskEvaluationService.class);

    public Evaluation evaluate(AIApplication app) {

        log.info("==================================================");
        log.info("Starting GovernAI risk evaluation");
        log.info("AI System: {}", app.getName());
        log.info("AI Type: {}", app.getAiType());
        log.info("Lifecycle: {}", app.getLifecycle());
        log.info("Decision Impact: {}", app.getDecisionImpact());
        log.info("Human Oversight: {}", app.getHumanOversight());
        log.info("Countries: {}", app.getCountries());
        log.info("Personal Data: {}", app.isPersonalData());
        log.info("Sensitive Data: {}", app.isSensitiveData());
        log.info("External AI Provider: {}", app.isExternalAiProvider());

        int privacy = scorePrivacy(app);
        int security = scoreSecurity(app);
        int fairness = scoreFairness(app);
        int transparency = scoreTransparency(app);
        int regulatory = scoreRegulatory(app);

        int overall = Math.round(
                (privacy + security + fairness + transparency + regulatory) / 5.0f
        );

        AssessmentRiskLevel riskLevel = AssessmentRiskLevel.fromScore(overall);

        log.info("Risk scores:");
        log.info("  Privacy: {}", privacy);
        log.info("  Security: {}", security);
        log.info("  Fairness: {}", fairness);
        log.info("  Transparency: {}", transparency);
        log.info("  Regulatory: {}", regulatory);
        log.info("Overall Risk Score: {}", overall);
        log.info("Overall Risk Level: {}", riskLevel);
        log.info("Risk evaluation completed");
        log.info("==================================================");

        StringBuilder explanation = new StringBuilder("GovernAI Risk Engine v1. ");
        explanation.append("Privacy ").append(privacy).append("/100, ");
        explanation.append("Security ").append(security).append("/100, ");
        explanation.append("Fairness ").append(fairness).append("/100, ");
        explanation.append("Transparency ").append(transparency).append("/100, ");
        explanation.append("Regulatory ").append(regulatory).append("/100. ");
        explanation.append("Higher-impact, production, sensitive-data, external-provider, and limited-oversight characteristics increase risk; human oversight reduces risk.");

        return new Evaluation(
                privacy,
                security,
                fairness,
                transparency,
                regulatory,
                overall,
                riskLevel,
                explanation.toString()
        );
    }

    private int scorePrivacy(AIApplication a) {
        int score = 10;

        if (a.isPersonalData()) score += 30;
        if (a.isSensitiveData()) score += 30;
        if (a.isExternalAiProvider()) score += 15;
        if (a.getLifecycle() == Lifecycle.PRODUCTION) score += 10;

        return clamp(score);
    }

    private int scoreSecurity(AIApplication a) {
        int score = 15;

        if (a.isExternalAiProvider()) score += 25;
        if (a.getLifecycle() == Lifecycle.PRODUCTION) score += 20;
        if (a.getDecisionImpact() == DecisionImpact.HIGH) score += 20;
        if (a.getDecisionImpact() == DecisionImpact.CRITICAL) score += 30;
        if (a.getAiType() == AIType.GENERATIVE_AI) score += 10;

        return clamp(score);
    }

    private int scoreFairness(AIApplication a) {
        int score = 10;

        score += impactPoints(a.getDecisionImpact());

        if (a.getAiType() == AIType.PREDICTIVE_ML ||
                a.getAiType() == AIType.RECOMMENDATION) {
            score += 15;
        }

        if (a.getHumanOversight() == HumanOversight.NONE) {
            score += 20;
        } else if (a.getHumanOversight() == HumanOversight.HUMAN_APPROVAL) {
            score -= 10;
        }

        if (a.getLifecycle() == Lifecycle.PRODUCTION) {
            score += 10;
        }

        return clamp(score);
    }

    private int scoreTransparency(AIApplication a) {
        int score = 15;

        if (a.getAiType() == AIType.GENERATIVE_AI) score += 25;

        if (a.getHumanOversight() == HumanOversight.NONE) {
            score += 25;
        } else if (a.getHumanOversight() == HumanOversight.HUMAN_APPROVAL) {
            score -= 10;
        }

        if (a.getDecisionImpact() == DecisionImpact.HIGH) score += 15;
        if (a.getDecisionImpact() == DecisionImpact.CRITICAL) score += 25;
        if (a.getLifecycle() == Lifecycle.PRODUCTION) score += 10;

        return clamp(score);
    }

    private int scoreRegulatory(AIApplication a) {
        int score = 10 + Math.min(a.getCountries().size() * 5, 15);

        score += impactPoints(a.getDecisionImpact());

        if (a.isSensitiveData()) score += 20;
        if (a.isPersonalData()) score += 10;
        if (a.getLifecycle() == Lifecycle.PRODUCTION) score += 10;

        return clamp(score);
    }

    private int impactPoints(DecisionImpact impact) {
        return switch (impact) {
            case LOW -> 0;
            case MEDIUM -> 10;
            case HIGH -> 25;
            case CRITICAL -> 40;
        };
    }

    private int clamp(int score) {
        return Math.max(0, Math.min(100, score));
    }

    public record Evaluation(
            int privacy,
            int security,
            int fairness,
            int transparency,
            int regulatory,
            int overall,
            AssessmentRiskLevel riskLevel,
            String explanation
    ) {
    }
}