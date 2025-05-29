package org.jane.morajaati.users.domain.model;

public record CreateUserModel(
        String firstName,
        String lastName,
        String email,
        String password,
        UserRole role
) {
}
