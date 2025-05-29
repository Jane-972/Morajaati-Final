package org.jane.morajaati.chapters.documents.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChapterDocumentRepository extends JpaRepository<ChapterDocumentEntity, UUID> {
  List<ChapterDocumentEntity> findByChapterId(UUID chapterId);
}
