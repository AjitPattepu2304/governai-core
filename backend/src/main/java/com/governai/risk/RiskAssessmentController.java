package com.governai.risk;

import com.governai.aisystem.AIApplication;
import com.governai.aisystem.AIApplicationRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/risk-assessments")
@CrossOrigin(origins = "*")
public class RiskAssessmentController {
    private final RiskAssessmentRepository assessments;
    private final AIApplicationRepository applications;

    public RiskAssessmentController(RiskAssessmentRepository assessments, AIApplicationRepository applications) {
        this.assessments = assessments; this.applications = applications;
    }

    @GetMapping("/ai-system/{aiSystemId}")
    public List<RiskAssessment> findForSystem(@PathVariable Long aiSystemId) { return assessments.findByAiApplicationId(aiSystemId); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RiskAssessment create(@Valid @RequestBody CreateRiskAssessmentRequest request) {
        AIApplication app = applications.findById(request.aiSystemId()).orElseThrow(() -> new IllegalArgumentException("AI system not found: " + request.aiSystemId()));
        return assessments.save(new RiskAssessment(app, request.privacyScore(), request.securityScore(), request.fairnessScore(), request.transparencyScore(), request.regulatoryScore()));
    }

    public record CreateRiskAssessmentRequest(@NotNull Long aiSystemId,
        @Min(0) @Max(100) int privacyScore, @Min(0) @Max(100) int securityScore,
        @Min(0) @Max(100) int fairnessScore, @Min(0) @Max(100) int transparencyScore,
        @Min(0) @Max(100) int regulatoryScore) {}
}
