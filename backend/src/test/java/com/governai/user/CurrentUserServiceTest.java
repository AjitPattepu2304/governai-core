package com.governai.user;

import com.governai.organization.Organization;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class CurrentUserServiceTest {

    @Test
    void requireUserReturnsSessionUser() {
        AppUserRepository users = mock(AppUserRepository.class);
        HttpSession session = mock(HttpSession.class);
        Organization organization = new Organization("Acme", "US");
        AppUser user = new AppUser("Admin", "admin@acme.com", "hash", organization, UserRole.ADMIN);

        when(session.getAttribute(CurrentUserService.SESSION_USER_ID)).thenReturn(42L);
        when(users.findByIdWithOrganization(42L)).thenReturn(Optional.of(user));

        assertEquals(user, new CurrentUserService(users).requireUser(session));
    }

    @Test
    void requireUserRejectsMissingSession() {
        AppUserRepository users = mock(AppUserRepository.class);
        HttpSession session = mock(HttpSession.class);
        when(session.getAttribute(CurrentUserService.SESSION_USER_ID)).thenReturn(null);

        assertThrows(org.springframework.web.server.ResponseStatusException.class,
                () -> new CurrentUserService(users).requireUser(session));
        verifyNoInteractions(users);
    }
}
