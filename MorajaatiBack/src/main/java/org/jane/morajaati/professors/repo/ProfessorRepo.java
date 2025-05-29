package org.jane.morajaati.professors.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface ProfessorRepo extends JpaRepository<ProfessorEntity, UUID> {
    @Query("""
                SELECT new ProfessorEntity(
                    u.id,
                    u.firstName,
                    u.lastName,
                    u.email,
                    u.password,
                    u.approved,
                    p.specialisation,
                    p.description
                )
                FROM org.jane.morajaati.users.repo.UserEntity u
                LEFT JOIN ProfessorEntity p ON u.id = p.id
                WHERE u.role = 'TEACHER'
            """)
    List<ProfessorEntity> findAllTeachers();

    @Query("""
                SELECT new ProfessorEntity(
                    u.id,
                    u.firstName,
                    u.lastName,
                    u.email,
                    u.password,
                    u.approved,
                    p.specialisation,
                    p.description
                )
                FROM org.jane.morajaati.users.repo.UserEntity u
                LEFT JOIN ProfessorEntity p ON u.id = p.id
                WHERE u.role = 'TEACHER'
                    AND u.id in :ids
            """)
    List<ProfessorEntity> findAllTeachersByIds(@Param("ids") Collection<UUID> ids);
}