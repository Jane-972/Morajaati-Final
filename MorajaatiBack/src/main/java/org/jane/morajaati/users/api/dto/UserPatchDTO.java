package org.jane.morajaati.users.api.dto;

import jakarta.annotation.Nullable;
import org.jane.morajaati.users.domain.model.PatchUserModel;

public record UserPatchDTO(
        @Nullable String firstName,
        @Nullable String lastName,
        @Nullable String email,
        @Nullable String password
) {
    public PatchUserModel toModel() {
        return new PatchUserModel(firstName, lastName, email, password);
    }
}
