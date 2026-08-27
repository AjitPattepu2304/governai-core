package com.governai.aisystem;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/ai-systems")
@CrossOrigin(origins = "*")
public class AIApplicationController {
    private final AIApplicationRepository repository;
    public AIApplicationController(AIApplicationRepository repository) { this.repository = repository; }

    @GetMapping public List<AIApplication> findAll() { return repository.findAll(); }

    @GetMapping("/{id}") public AIApplication findById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new AIApplicationNotFoundException(id));
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public AIApplication create(@Valid @RequestBody CreateAIApplicationRequest request) {
        return repository.save(new AIApplication(request.name(), request.purpose(), request.owner(), request.businessUnit(), request.riskLevel(), request.countries(), request.aiType(), request.lifecycle(), request.decisionImpact(), request.humanOversight(), request.personalData(), request.sensitiveData(), request.externalAiProvider()));
    }

    public record CreateAIApplicationRequest(
        @NotBlank String name, @NotBlank String purpose, @NotBlank String owner, @NotBlank String businessUnit,
        @NotNull RiskLevel riskLevel, @NotEmpty Set<CountryCode> countries, @NotNull AIType aiType,
        @NotNull Lifecycle lifecycle, @NotNull DecisionImpact decisionImpact, @NotNull HumanOversight humanOversight,
        boolean personalData, boolean sensitiveData, boolean externalAiProvider) {}

    @ResponseStatus(HttpStatus.NOT_FOUND)
    static class AIApplicationNotFoundException extends RuntimeException {
        AIApplicationNotFoundException(Long id) { super("AI system not found: " + id); }
    }
}
