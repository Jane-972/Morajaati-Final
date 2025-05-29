package org.jane.morajaati.courses.repo.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepo extends JpaRepository<CourseEntity, UUID> {
  List<CourseEntity> findByProfessorId(UUID professorId);
  int countByProfessorId(UUID professorId);
}
