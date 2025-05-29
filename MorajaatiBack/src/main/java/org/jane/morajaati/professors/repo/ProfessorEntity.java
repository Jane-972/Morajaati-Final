package org.jane.morajaati.professors.repo;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import org.jane.morajaati.professors.api.dto.ProfessorOutputDTO;
import org.jane.morajaati.professors.domain.model.ProfessorModel;
import org.jane.morajaati.users.domain.model.UserRole;
import org.jane.morajaati.users.repo.UserEntity;

import java.util.UUID;


@Entity
@Table(name = "professors")
@PrimaryKeyJoinColumn(name = "id")
public class ProfessorEntity extends UserEntity {
    @Column(name = "specialisation")
    private String specialisation;

    @Column(name = "description")
    private String description;

    public ProfessorEntity() {
    }

    public ProfessorEntity(
            UUID id,
            String firstName,
            String lastName,
            String email,
            String password,
            Boolean isApproved,
            String specialisation,
            String description) {
        super(id, firstName, lastName, email, password, UserRole.TEACHER, isApproved);
        this.specialisation = specialisation;
        this.description = description;
    }

    public ProfessorModel toProfessorModel() {
        return new ProfessorModel(
                id,
                firstName,
                lastName,
                email,
                password,
                specialisation,
                description
        );
    }

    // Getters and Setters
    public String getSpecialisation() {
        return specialisation;
    }

    public String getDescription() {
        return description;
    }

    // Optional utility method to map to ProfessorOutputDTO
    public ProfessorOutputDTO toProfessorOutputDTO() {
        return new ProfessorOutputDTO(
                getId(),
                getFirstName(),
                getLastName(),
                this.specialisation,
                this.description
        );
    }
}


