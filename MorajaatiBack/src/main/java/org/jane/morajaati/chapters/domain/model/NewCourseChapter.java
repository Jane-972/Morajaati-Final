package org.jane.morajaati.chapters.domain.model;

import java.util.UUID;

public record NewCourseChapter(
        String title,
        String description,
        UUID thumbnail
) {
}
