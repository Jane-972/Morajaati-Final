package org.jane.morajaati.common.security;

import org.jane.morajaati.users.domain.model.UserModel;
import org.jane.morajaati.users.domain.model.UserRole;
import org.jane.morajaati.users.repo.UserStorageFacade;
import org.springframework.context.annotation.Bean;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class MyUserDetailsService implements UserDetailsService {
    private final UserStorageFacade usageStorageFacade;

    public MyUserDetailsService(UserStorageFacade usageStorageFacade) {this.usageStorageFacade = usageStorageFacade;}

    @Override
    public UserDetails loadUserByUsername(String username) {
        UserModel userModel = usageStorageFacade.fetchUserByEmail(username);

        if (userModel != null) {
            return new User(
                userModel.id().toString(),
                userModel.password(),
                getAuthorities(userModel)
            );

        } else {
            System.out.println("User with id " + username + " not found");
            return null;
        }
    }

    Collection<GrantedAuthority> getAuthorities(UserModel user) {
        if (!user.approved()) {
            return Collections.emptyList();
        } else {
            return Collections.singletonList(new SimpleGrantedAuthority(ROLE_PREFIX + user.role().name()));
        }
    }

    @Bean
    static RoleHierarchy roleHierarchy() {
        return RoleHierarchyImpl.withDefaultRolePrefix()
                .role(UserRole.ADMIN.name()).implies(UserRole.STUDENT.name())
                .role(UserRole.ADMIN.name()).implies(UserRole.TEACHER.name())
                .role(UserRole.TEACHER.name()).implies(UserRole.STUDENT.name())
                .build();
    }

    private static final String ROLE_PREFIX = "ROLE_";
}
