package org.jane.morajaati.courses.repo.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseDocumentRepo extends JpaRepository<CourseDocumentEntity, UUID> {
    List<CourseDocumentEntity> findAllByCourseId(UUID courseId);
}
