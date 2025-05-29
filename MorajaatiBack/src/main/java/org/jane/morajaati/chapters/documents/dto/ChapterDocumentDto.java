package org.jane.morajaati.chapters.documents.dto;

import org.jane.morajaati.chapters.documents.domain.model.ChapterDocumentModel;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChapterDocumentDto(
  UUID id,
  UUID chapterId,
  UUID documentId,
  String fileName,
  LocalDateTime createdAt
) {
  public static ChapterDocumentDto fromModel(ChapterDocumentModel model) {
    return new ChapterDocumentDto(
      model.id(),
      model.chapterId(),
      model.documentId(),
      model.fileName(),
      model.createdAt()
    );
  }
}
