package com.governai.risk;

import com.governai.aisystem.AIApplication;
import com.governai.aisystem.AIApplicationRepository;
import com.governai.user.AppUser;
import com.governai.user.CurrentUserService;
import jakarta.servlet.http.HttpSession;
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
    private final CurrentUserService currentUser;

    public RiskAssessmentController(RiskAssessmentRepository assessments, AIApplicationRepository applications,
                                    RiskEvaluationService evaluationService, CurrentUserService currentUser) {
        this.assessments = assessments;
        this.applications = applications;
        this.evaluationService = evaluationService;
        this.currentUser = currentUser;
    }

    @GetMapping("/ai-system/{aiSystemId}")
    public List<RiskAssessment> findForSystem(@PathVariable Long aiSystemId, HttpSession session) {
        AppUser user = currentUser.requireUser(session);
        return assessments.findByAiApplicationIdAndAiApplicationOrganizationId(aiSystemId, user.getOrganization().getId());
    }

    @GetMapping
    public List<RiskAssessment> findAll(HttpSession session) {
        AppUser user = currentUser.requireUser(session);
        return assessments.findAllByAiApplicationOrganizationId(user.getOrganization().getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RiskAssessment create(@Valid @RequestBody CreateRiskAssessmentRequest request, HttpSession session) {
        AppUser user = currentUser.requireUser(session);
        AIApplication app = applications.findByIdAndOrganizationId(request.aiSystemId(), user.getOrganization().getId())
                .orElseThrow(() -> new IllegalArgumentException("AI system not found: " + request.aiSystemId()));
        RiskEvaluationService.Evaluation e = evaluationService.evaluate(app);
        return assessments.save(new RiskAssessment(app, e.privacy(), e.security(), e.fairness(), e.transparency(), e.regulatory(), "v1", e.explanation()));
    }

    public record CreateRiskAssessmentRequest(@NotNull Long aiSystemId) {
    }
}
