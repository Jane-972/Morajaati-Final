package org.jane.morajaati.chapters.documents.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "chapter_documents")
public class ChapterDocumentEntity {
  @Id
  private UUID id;

  private UUID chapterId;
  private UUID documentId;
  private String fileName;
  private LocalDateTime createdAt;

  public ChapterDocumentEntity() {
  }

  public ChapterDocumentEntity(UUID id, UUID chapterId, UUID documentId, String fileName, LocalDateTime createdAt) {
    this.id = id;
    this.chapterId = chapterId;
    this.documentId = documentId;
    this.fileName = fileName;
    this.createdAt = createdAt;
  }

  public UUID getId() {
    return id;
  }

  public UUID getChapterId() {
    return chapterId;
  }

  public UUID getDocumentId() {
    return documentId;
  }

  public String getFileName() {
    return fileName;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
