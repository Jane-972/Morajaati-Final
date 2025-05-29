package org.jane.morajaati.chapters.documents.repo;

import org.jane.morajaati.chapters.documents.domain.model.ChapterDocumentModel;
import org.jane.morajaati.chapters.domain.model.CourseChapter;
import org.jane.morajaati.chapters.repo.ChapterRepository;
import org.jane.morajaati.common.service.UuidGenerator;
import org.jane.morajaati.courses.repo.document.CourseDocumentEntity;
import org.jane.morajaati.documents.domain.model.Document;
import org.jane.morajaati.documents.domain.model.FileType;
import org.jane.morajaati.documents.domain.service.DocumentService;
import org.jane.morajaati.documents.repo.DocumentRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChapterDocumentFacade {
  private final DocumentService documentService;
  private final ChapterRepository chapterRepository;
  private final ChapterDocumentRepository chapterDocumentRepository;
  private final UuidGenerator uuidGenerator;
  private final DocumentRepo documentRepo;



  public ChapterDocumentFacade(DocumentService documentService, ChapterRepository chapterRepository, ChapterDocumentRepository chapterDocumentRepository, UuidGenerator uuidGenerator, DocumentRepo documentRepo) {
    this.documentService = documentService;
    this.chapterRepository = chapterRepository;
    this.chapterDocumentRepository = chapterDocumentRepository;
    this.uuidGenerator = uuidGenerator;
    this.documentRepo = documentRepo;
  }

  public void storeFile(UUID currentUserId, UUID chapterId, FileType fileType, String fileName, Document storedDocument) {
    if (!chapterRepository.existsById(chapterId)) {
      throw new IllegalArgumentException("Chapter not found");
    }

    ChapterDocumentEntity entity = new ChapterDocumentEntity(
      uuidGenerator.generateId(),
      chapterId,
      storedDocument.id(),
      fileName,
      LocalDateTime.now()
    );

    chapterDocumentRepository.save(entity);

    System.out.printf("Stored %s file (%s) for chapter %s%n", fileType, fileName, chapterId);
  }


  public List<ChapterDocumentModel> getDocumentsByChapterId(UUID chapterId) {
    List<ChapterDocumentEntity> entities = chapterDocumentRepository.findByChapterId(chapterId);
    return entities.stream()
      .map(ChapterDocumentModel::fromEntity)
      .toList();
  }

}
