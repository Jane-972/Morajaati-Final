package org.jane.morajaati.courses.repo.document;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import org.jane.morajaati.courses.domain.model.CourseDocument;

import java.util.UUID;

@Entity
@Table(name = "course_documents")
public class CourseDocumentEntity {
    @Getter
    @Id
    private UUID id;
    private String name;
    private UUID courseId;
    private UUID documentId;

    public CourseDocumentEntity() {
    }

    public CourseDocumentEntity(UUID id, String name, UUID courseId, UUID documentId) {
        this.id = id;
        this.name = name;
        this.courseId = courseId;
        this.documentId = documentId;
    }

    public CourseDocument toModel() {
        return new CourseDocument(id, name, courseId, documentId);
    }
}
