package org.jane.morajaati.chapters.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChapterRepository extends JpaRepository<ChapterEntity, UUID> {
    List<ChapterEntity> findAllByCourseId(UUID courseId);
}
