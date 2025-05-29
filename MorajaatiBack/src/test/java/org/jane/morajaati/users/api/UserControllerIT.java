package org.jane.morajaati.users.api;

import org.jane.morajaati.IntegrationTestBase;
import org.jane.morajaati.users.domain.model.UserRole;
import org.jane.morajaati.users.repo.UserEntity;
import org.jane.morajaati.users.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.json.JsonCompareMode;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jane.morajaati.TestObjects.UserIds.USER_ID_1;
import static org.jane.morajaati.TestObjects.UserIds.USER_ID_2;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


class UserControllerIT extends IntegrationTestBase {
    @Autowired
    UserRepo userRepo;

    private static void assertSimilar(UserEntity expectedUser, UserEntity actualUser) {
        assertThat(actualUser.getId()).isEqualTo(expectedUser.getId());
        assertThat(actualUser.getFirstName()).isEqualTo(expectedUser.getFirstName());
        assertThat(actualUser.getLastName()).isEqualTo(expectedUser.getLastName());
        assertThat(actualUser.getEmail()).isEqualTo(expectedUser.getEmail());
        assertThat(actualUser.isApproved()).isEqualTo(expectedUser.isApproved());
        assertThat(actualUser.getRole()).isEqualTo(expectedUser.getRole());
    }

    @BeforeEach
    void setUp() {
        userRepo.deleteAll();
    }

    @Nested
    @DisplayName("When creating a new user")
    class UserCreationTest {
        @Test
        @DisplayName("Then the user should be created and approved if it's the first user")
        void shouldAddAndApproveFirstUser() throws Exception {
            Mockito.when(uuidGenerator.generateId()).thenReturn(USER_ID_1);

            mvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                {
                                    "firstName": "jane",
                                    "lastName": "doe",
                                    "email": "jane-doe@mail.com",
                                    "password": "1234",
                                    "role": "STUDENT"
                                }
                                """
                            )
                    )
                    .andExpect(status().isCreated())
                    .andExpect(content().json(
                            """
                                    {
                                        "id": "8a8ac60c-fbcc-4921-9349-a3105f570450",
                                        "firstName": "jane",
                                        "lastName": "doe",
                                        "email": "jane-doe@mail.com",
                                        "role" : "ADMIN"
                                    }
                                    """,
                            JsonCompareMode.STRICT
                    ))
            ;

            // Check DB content
            List<UserEntity> storedUsers = userRepo.findAll();
            assertEquals(1, storedUsers.size());
            assertSimilar(
                    new UserEntity(USER_ID_1, "jane", "doe", "jane-doe@mail.com", "1234", UserRole.ADMIN, true),
                    storedUsers.get(0)
            );
        }

        @Test
        @DisplayName("Then the user should be created but not approved if it's not the first user")
        void shouldNotApproveSecondUser() throws Exception {
            Mockito.when(uuidGenerator.generateId()).thenReturn(USER_ID_2);

            // Add first user
            userRepo.save(new UserEntity(USER_ID_1, "jane", "doe", "jane-doe@mail.com", "1234", UserRole.ADMIN, true));

            mvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                {
                                    "firstName": "Toni",
                                    "lastName": "Simmons",
                                    "email": "toni-simmons@mail.com",
                                    "password": "1234",
                                    "role": "STUDENT"
                                }
                                """
                            )
                    )
                    .andExpect(status().isCreated())
                    .andExpect(content().json(
                            """
                                    {
                                        "id": "4854a8d8-85d9-4fd1-a8e4-91d601f1a8dd",
                                        "firstName": "Toni",
                                        "lastName": "Simmons",
                                        "email": "toni-simmons@mail.com",
                                        "role" : "STUDENT"
                                    }
                                    """,
                            JsonCompareMode.STRICT
                    ))
            ;

            // Check DB content
            UserEntity newUserEntity = userRepo.findById(USER_ID_2).orElseThrow();
            assertSimilar(
                    new UserEntity(USER_ID_2, "Toni", "Simmons", "toni-simmons@mail.com", "1234", UserRole.STUDENT, false),
                    newUserEntity
            );
        }
    }
}
