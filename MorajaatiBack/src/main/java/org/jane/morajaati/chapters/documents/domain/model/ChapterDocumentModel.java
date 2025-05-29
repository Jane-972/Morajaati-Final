package org.jane.morajaati.chapters.documents.domain.model;

import org.jane.morajaati.chapters.documents.repo.ChapterDocumentEntity;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChapterDocumentModel(
  UUID id,
  UUID chapterId,
  UUID documentId,
  String fileName,
  LocalDateTime createdAt
) {
  public static ChapterDocumentModel fromEntity(ChapterDocumentEntity entity) {
    return new ChapterDocumentModel(
      entity.getId(),
      entity.getChapterId(),
      entity.getDocumentId(),
      entity.getFileName(),
      entity.getCreatedAt()
    );
  }
}
