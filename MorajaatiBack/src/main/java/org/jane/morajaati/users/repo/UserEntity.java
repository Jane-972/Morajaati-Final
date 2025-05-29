package org.jane.morajaati.users.repo;


import jakarta.persistence.*;
import org.jane.morajaati.professors.domain.model.ProfessorModel;
import org.jane.morajaati.users.domain.model.UserModel;
import org.jane.morajaati.users.domain.model.UserRole;

import java.util.UUID;

@Entity(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class UserEntity {
    @Id
    protected UUID id;
    protected String firstName;
    protected String lastName;
    protected String email;
    protected String password;
    protected boolean approved;
    @Enumerated(EnumType.STRING)
    protected UserRole role;

    public UserEntity() {
    }

    public UserEntity(UUID id, String firstName, String lastName, String email, String password, UserRole role, Boolean isApproved) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.approved = isApproved;
    }

    public UserModel toModel() {
        return new UserModel(
                id,
                firstName,
                lastName,
                email,
                password,
                approved,
                role
        );
    }

    public String getLastName() {
        return lastName;
    }

    public UUID getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getEmail() {
        return email;
    }

    public boolean isApproved() {
        return approved;
    }

    public UserRole getRole() {
        return role;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public ProfessorModel toProfessorModel() {
        return new ProfessorModel(
                id,
                firstName,
                lastName,
                email,
                password,
                null,
                null
        );
    }

}
