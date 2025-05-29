package org.jane.morajaati.chapters.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public record CourseChapter(
        UUID id,
        UUID courseId,
        String title,
        String description,
        LocalDateTime createdAt,
        UUID thumbnail
) {
}
