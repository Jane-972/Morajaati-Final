package org.jane.morajaati.courses.repo.document;

import org.jane.morajaati.chapters.domain.model.CourseChapter;
import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.courses.domain.model.CourseDocument;
import org.jane.morajaati.documents.domain.model.Document;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CourseDocumentFacade {
    private final CourseDocumentRepo documentRepo;

    public CourseDocumentFacade(CourseDocumentRepo documentRepo) {
        this.documentRepo = documentRepo;
    }

    public List<CourseDocument> getAllDocuments() {
        return documentRepo.findAll()
                .stream()
                .map(CourseDocumentEntity::toModel)
                .toList();
    }


    public List<CourseDocument> getCourseDocuments(Course course) {
        return documentRepo.findAllByCourseId(course.id())
                .stream()
                .map(CourseDocumentEntity::toModel)
                .toList();
    }

    public void storeFile(Course course, Document storedDocument, String name) {
        documentRepo.save(
                new CourseDocumentEntity(
                        UUID.randomUUID(),
                        name,
                        course.id(),
                        storedDocument.id()
                )
        );
    }
}
