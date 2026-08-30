package com.governai.risk;

public enum AssessmentRiskLevel {
    LOW, MEDIUM, HIGH, CRITICAL;

    public static AssessmentRiskLevel fromScore(double score) {
        if (score >= 80) return CRITICAL;
        if (score >= 60) return HIGH;
        if (score >= 30) return MEDIUM;
        return LOW;
    }
}
