package org.jane.morajaati.professors.domain.model;

import java.util.UUID;

public record ProfessorModel(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String password,
        String specialisation,
        String description
) {
}
