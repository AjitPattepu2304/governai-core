package com.governai.user;

import com.governai.organization.Organization;
import com.governai.organization.OrganizationRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176"
        },
        allowCredentials = "true"
)

public class AuthController {
    private static final String USER_ID = "GOVERN_AI_USER_ID";
    private final AppUserRepository users;
    private final OrganizationRepository organizations;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthController(AppUserRepository users, OrganizationRepository organizations, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.users = users; this.organizations = organizations; this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request, HttpSession session) {
        if (users.existsByEmailIgnoreCase(request.email())) throw new IllegalArgumentException("An account already exists for this email.");
        Organization organization = organizations.save(new Organization(request.organizationName(), request.countryCode()));
        AppUser user = users.save(new AppUser(request.name(), request.email().trim().toLowerCase(), passwordEncoder.encode(request.password()), organization, UserRole.ADMIN));
        session.setAttribute(USER_ID, user.getId());
        return response(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        AppUser user = users.findByEmailIgnoreCase(request.email()).orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) throw new IllegalArgumentException("Invalid email or password.");
        session.setAttribute(USER_ID, user.getId());
        return response(user);
    }

    @GetMapping("/me")
    public AuthResponse me(HttpSession session) {
        Object id = session.getAttribute(USER_ID);
        if (id == null) throw new UnauthorizedException();
        return users.findById((Long) id).map(this::response).orElseThrow(UnauthorizedException::new);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpSession session) { session.invalidate(); }

    private AuthResponse response(AppUser user) { return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.getOrganization().getId(), user.getOrganization().getName()); }

    public record RegisterRequest(@NotBlank String name, @Email @NotBlank String email, @Size(min=8, max=100) String password, @NotBlank String organizationName, @NotBlank String countryCode) {}
    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record AuthResponse(Long id, String name, String email, String role, Long organizationId, String organizationName) {}
    @ResponseStatus(HttpStatus.UNAUTHORIZED) static class UnauthorizedException extends RuntimeException {}
}
