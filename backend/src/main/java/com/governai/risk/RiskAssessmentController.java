package com.governai.risk;

import com.governai.aisystem.AIApplication;
import com.governai.aisystem.AIApplicationRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/risk-assessments")
public class RiskAssessmentController {
    private final RiskAssessmentRepository assessments;
    private final AIApplicationRepository applications;
    private final RiskEvaluationService evaluationService;

    public RiskAssessmentController(RiskAssessmentRepository assessments, AIApplicationRepository applications, RiskEvaluationService evaluationService) {
        this.assessments = assessments; this.applications = applications; this.evaluationService = evaluationService;
    }

    @GetMapping("/ai-system/{aiSystemId}")
    public List<RiskAssessment> findForSystem(@PathVariable Long aiSystemId) { return assessments.findByAiApplicationId(aiSystemId); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RiskAssessment create(@Valid @RequestBody CreateRiskAssessmentRequest request) {
        AIApplication app = applications.findById(request.aiSystemId()).orElseThrow(() -> new IllegalArgumentException("AI system not found: " + request.aiSystemId()));
        RiskEvaluationService.Evaluation e = evaluationService.evaluate(app);
        return assessments.save(new RiskAssessment(app, e.privacy(), e.security(), e.fairness(), e.transparency(), e.regulatory(), "v1", e.explanation()));
    }

    public record CreateRiskAssessmentRequest(@NotNull Long aiSystemId) {}
}
