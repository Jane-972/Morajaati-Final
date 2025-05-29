package org.jane.morajaati.users.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.jane.morajaati.users.domain.model.CreateUserModel;
import org.jane.morajaati.users.domain.model.UserRole;

public record UserInputDTO(
        @NotNull(message = "First name is required")
        @NotEmpty(message = "First name cannot be empty")
        String firstName,

        @NotNull(message = "Last name is required")
        @NotEmpty(message = "Last name cannot be empty")
        String lastName,

        @NotNull(message = "Email is required")
        @Email(message = "Email should be valid")
        String email,

        @NotNull(message = "Password is required")
        String password,

        @NotNull(message = "Role is required")
        UserRole role
) {
    public CreateUserModel toModel() {
        return new CreateUserModel(
                this.firstName,
                this.lastName,
                this.email,
                this.password,
                this.role
        );
    }
}
