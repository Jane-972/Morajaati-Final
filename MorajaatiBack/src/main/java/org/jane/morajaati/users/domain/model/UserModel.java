package org.jane.morajaati.users.domain.model;

import java.util.UUID;

public record UserModel(
    UUID id,
    String firstName,
    String lastName,
    String email,
    String password,
    boolean approved,
    UserRole role
) {
}
