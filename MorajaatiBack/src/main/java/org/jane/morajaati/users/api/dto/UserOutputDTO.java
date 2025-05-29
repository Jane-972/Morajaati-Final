package org.jane.morajaati.users.api.dto;


import org.jane.morajaati.users.domain.model.UserModel;
import org.jane.morajaati.users.domain.model.UserRole;

import java.util.UUID;

public record UserOutputDTO(
        UUID id,
        String firstName,
        String lastName,
        String email,
        UserRole role
) {
    public static UserOutputDTO fromModel(UserModel userModel) {
        return new UserOutputDTO(
                userModel.id(),
                userModel.firstName(),
                userModel.lastName(),
                userModel.email(),
                userModel.role()
        );
    }
}
