package org.jane.morajaati.professors.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.jane.morajaati.professors.domain.model.ProfessorModel;

import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProfessorOutputDTO(
  UUID id,
  String firstName,
  String lastName,
  String specialisation,
  String description
) {
  // Static method to convert ProfessorEntity to ProfessorOutputDTO
  public static ProfessorOutputDTO fromModel(ProfessorModel professor) {
    return new ProfessorOutputDTO(
      professor.id(),
      professor.firstName(),
      professor.lastName(),
      professor.specialisation(),
      professor.description()
    );
  }
}

