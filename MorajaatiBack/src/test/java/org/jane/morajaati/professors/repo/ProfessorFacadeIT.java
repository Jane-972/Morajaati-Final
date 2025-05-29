package org.jane.morajaati.professors.repo;

import org.jane.morajaati.IntegrationTestBase;
import org.jane.morajaati.professors.domain.model.ProfessorModel;
import org.jane.morajaati.users.domain.model.UserRole;
import org.jane.morajaati.users.repo.UserEntity;
import org.jane.morajaati.users.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Set;

import static org.jane.morajaati.TestObjects.UserEntities.generateProfessorEntity;
import static org.jane.morajaati.TestObjects.UserEntities.generateUserEntity;
import static org.jane.morajaati.TestObjects.UserIds.*;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;

class ProfessorFacadeIT extends IntegrationTestBase {
    @Autowired
    UserRepo userRepo;

    @Autowired
    ProfessorRepo professorRepo;

    @Autowired
    ProfessorFacade professorFacade;

    @BeforeEach
    void setUp() {
        professorRepo.deleteAll();
        userRepo.deleteAll();
    }

    @Test
    void shouldReturnAllProfessors() {
        UserEntity userEntity1 = generateUserEntity(USER_ID_1, UserRole.TEACHER); // Professor without prof info
        UserEntity userEntity2 = generateUserEntity(USER_ID_2, UserRole.STUDENT);

        ProfessorEntity professorEntity = generateProfessorEntity(USER_ID_3);

        userRepo.saveAll(List.of(userEntity1, userEntity2));
        professorRepo.save(professorEntity);

        List<ProfessorModel> allProfessors = professorFacade.getAllProfessors();

        List<ProfessorModel> expected = List.of(
                userEntity1.toProfessorModel(),
                professorEntity.toProfessorModel()
        );

        assertIterableEquals(expected, allProfessors);
    }

    @Test
    void shouldReturnAllProfessorsByIds() {
        ProfessorEntity professorEntity1 = generateProfessorEntity(USER_ID_1);
        ProfessorEntity professorEntity2 = generateProfessorEntity(USER_ID_2);
        ProfessorEntity professorEntity3 = generateProfessorEntity(USER_ID_3);

        professorRepo.saveAll(List.of(professorEntity1, professorEntity2, professorEntity3));

        List<ProfessorModel> allProfessors = professorFacade.getAllProfessorsByIds(Set.of(USER_ID_1, USER_ID_3));

        List<ProfessorModel> expected = List.of(
                professorEntity1.toProfessorModel(),
                professorEntity3.toProfessorModel()
        );

        assertIterableEquals(expected, allProfessors);
    }
}