package org.jane.morajaati.courses.api.dto;

import org.jane.morajaati.courses.domain.model.CourseDocument;

import java.util.UUID;

public record CourseDocumentOutputDTO(
        UUID id,
        String name,
        UUID courseId,
        UUID documentId
) {

    public static CourseDocumentOutputDTO fromModel(CourseDocument document) {
        return new CourseDocumentOutputDTO(
                document.id(),
                document.name(),
                document.courseId(),
                document.documentId()
        );
    }
}
