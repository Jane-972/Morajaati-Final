package org.jane.morajaati.users.domain.model;

import jakarta.annotation.Nullable;

public record PatchUserModel(
        @Nullable String firstName,
        @Nullable String lastName,
        @Nullable String email,
        @Nullable String password
) {
}