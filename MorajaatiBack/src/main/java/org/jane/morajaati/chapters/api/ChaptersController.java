package org.jane.morajaati.chapters.api;

import org.jane.morajaati.chapters.api.dto.CreateChapterRequestDto;
import org.jane.morajaati.chapters.api.dto.CreateChapterResponseDto;
import org.jane.morajaati.chapters.api.dto.GetChapterResponseDto;
import org.jane.morajaati.chapters.documents.domain.model.ChapterDocumentModel;
import org.jane.morajaati.chapters.documents.dto.ChapterDocumentDto;
import org.jane.morajaati.chapters.documents.dto.ChapterFileTypeDto;
import org.jane.morajaati.chapters.domain.model.CourseChapter;
import org.jane.morajaati.chapters.domain.service.ChaptersService;
import org.jane.morajaati.documents.domain.service.DocumentService;
import org.jane.morajaati.documents.repo.DocumentEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/chapters")
public class ChaptersController {
    private final Logger logger = LoggerFactory.getLogger(ChaptersController.class);

    private final ChaptersService chaptersService;
    private final DocumentService documentService;

    public ChaptersController(ChaptersService chaptersService, DocumentService documentService) {
        this.chaptersService = chaptersService;
      this.documentService = documentService;
    }

    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    @PostMapping("/{courseId}/chapters")
    @ResponseStatus(HttpStatus.CREATED)
    public CreateChapterResponseDto createChapter(
            @PathVariable UUID courseId,
            @RequestBody CreateChapterRequestDto requestDto
    ) {
        logger.info("Creating chapter for course {} and content {}", courseId, requestDto);
        CourseChapter newChapter = chaptersService.createChapter(courseId, requestDto.toModel());
        return CreateChapterResponseDto.fromModel(newChapter);
    }

    @GetMapping("/{courseId}/chapters")
    public Stream<GetChapterResponseDto> getCourseChapters(@PathVariable UUID courseId) {
        logger.info("Fetching chapters for course {}", courseId);

        return chaptersService.getAllChapters(courseId)
                .sorted(Comparator.comparing(CourseChapter::createdAt))
                .map(GetChapterResponseDto::fromModel);
    }

    @GetMapping("/{chapterId}")
    public CourseChapter getChapter(@PathVariable UUID chapterId) {
        logger.info("Fetching chapter of Id {}", chapterId);

        return chaptersService.getChapter(chapterId);
    }

    @PostMapping("/{chapterId}/upload/{type}")
    @ResponseStatus(HttpStatus.CREATED)
    public String uploadChapterFile(
      Principal principal,
      @PathVariable UUID chapterId,
      @PathVariable ChapterFileTypeDto type,
      @RequestParam("file") MultipartFile file,
      @RequestParam("name") String fileName
    ) {
        UUID currentUserId = UUID.fromString(principal.getName());
        logger.info("Received chapter file upload request: {}, by user: {}", file.getOriginalFilename(), currentUserId);

        chaptersService.saveChapterFile(currentUserId, chapterId, type.getFileType(), file, fileName);
        return "Chapter file uploaded successfully";
    }

    @GetMapping("/{chapterId}/documents")
    public List<ChapterDocumentDto> getChapterDocuments(@PathVariable UUID chapterId) {
        List<ChapterDocumentModel> documents = chaptersService.getChapterDocuments(chapterId);
        return documents.stream()
          .map(ChapterDocumentDto::fromModel)
          .toList();
    }

    @GetMapping("/{chapterId}/thumbnail")
    public ResponseEntity<Resource> downloadThumbnail(@PathVariable UUID chapterId) {
        Resource thumbnail = chaptersService.getThumbnailResource(chapterId);

        return ResponseEntity.ok()
          .contentType(MediaType.IMAGE_JPEG) // or IMAGE_PNG depending on the image type
          .body(thumbnail);
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<UrlResource> downloadDocument(@PathVariable UUID documentId) throws MalformedURLException {
        // Retrieve the document entity
        DocumentEntity document = documentService.getDocumentById(documentId);

        Path file = Paths.get(document.getFileUrl());
        Resource resource = new UrlResource(file.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
          .contentType(MediaType.parseMediaType(document.getContentType())) //
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
          .body((UrlResource) resource);
    }



}

