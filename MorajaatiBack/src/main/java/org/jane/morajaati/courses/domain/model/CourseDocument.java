package org.jane.morajaati.courses.domain.model;

import java.util.UUID;

public record CourseDocument(
        UUID id,
        String name,
        UUID courseId,
        UUID documentId
) {

}