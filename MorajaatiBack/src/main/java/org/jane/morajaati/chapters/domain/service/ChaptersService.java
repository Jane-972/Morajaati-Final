package org.jane.morajaati.chapters.domain.service;

import jakarta.transaction.Transactional;
import org.jane.morajaati.chapters.documents.domain.model.ChapterDocumentModel;
import org.jane.morajaati.chapters.documents.repo.ChapterDocumentFacade;
import org.jane.morajaati.chapters.domain.model.CourseChapter;
import org.jane.morajaati.chapters.domain.model.NewCourseChapter;
import org.jane.morajaati.chapters.repo.ChapterStorageFacade;
import org.jane.morajaati.common.exception.ResourceNotFoundException;
import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.courses.repo.course.CourseFacade;
import org.jane.morajaati.documents.domain.model.Document;
import org.jane.morajaati.documents.domain.model.FileType;
import org.jane.morajaati.documents.domain.service.DocumentService;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.MalformedURLException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class ChaptersService {
    private final CourseFacade courseFacade;
    private final ChapterStorageFacade chapterStorageFacade;
    private final ChapterDocumentFacade chapterDocumentFacade;
    private final DocumentService documentService;

    public ChaptersService(CourseFacade courseFacade, ChapterStorageFacade chapterStorageFacade, ChapterDocumentFacade chapterDocumentFacade, DocumentService documentService) {
        this.courseFacade = courseFacade;
        this.chapterStorageFacade = chapterStorageFacade;
      this.chapterDocumentFacade = chapterDocumentFacade;
      this.documentService = documentService;
    }

    public CourseChapter createChapter(UUID courseId, NewCourseChapter newChapter) {
        Course course = courseFacade.getCourseById(courseId);

        return chapterStorageFacade.save(course, newChapter);
    }

    public Stream<CourseChapter> getAllChapters(UUID courseId) {
        Course course = courseFacade.getCourseById(courseId);

        return chapterStorageFacade.getAll(course);
    }

    public CourseChapter getChapter(UUID chapterId){
        return chapterStorageFacade.getChapterById(chapterId);
    }

    @Transactional
    public void saveChapterFile(UUID currentUserId, UUID chapterId, FileType fileType, MultipartFile file, String fileName) {
        // Ensure chapter exists
        CourseChapter chapter = chapterStorageFacade.getChapterById(chapterId);

        // Save the document
        Document storedDocument = documentService.saveDocument(currentUserId, fileType, file);

        if (fileType == FileType.THUMBNAIL) {
            chapterStorageFacade.updateChapterThumbnail(chapter, storedDocument.id());
        } else {
            // Store the document properly as a chapter document
            chapterDocumentFacade.storeFile(currentUserId, chapterId, fileType, fileName, storedDocument);
        }
    }

    public UrlResource getThumbnailResource(UUID chapterId) {
        CourseChapter chapter = chapterStorageFacade.getChapterById(chapterId);

        if (chapter.thumbnail() == null) {
            throw new ResourceNotFoundException("This chapter has no thumbnail.");
        }

        File file = documentService.retrieveFile(chapter.thumbnail());

        try {
            return new UrlResource(file.toURI());
        } catch (MalformedURLException e) {
            throw new RuntimeException("Invalid file URL: " + file.getAbsolutePath(), e);
        }
    }




    public List<ChapterDocumentModel> getChapterDocuments(UUID chapterId) {
        return chapterDocumentFacade.getDocumentsByChapterId(chapterId);
    }

}
