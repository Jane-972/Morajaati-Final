package org.jane.morajaati.professors.domain.model;

import org.jane.morajaati.users.domain.model.CreateUserModel;
import org.jane.morajaati.users.domain.model.UserRole;

public record CreateProfessorModel(
  String firstName,
  String lastName,
  String email,
  String password,
  String specialisation,
  String description
) {
  public CreateUserModel toUserModel() {
    return new CreateUserModel(firstName, lastName, email, password, UserRole.TEACHER);
  }
}
