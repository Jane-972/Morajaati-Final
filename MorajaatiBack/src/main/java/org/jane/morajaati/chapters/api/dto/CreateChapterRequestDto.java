package org.jane.morajaati.chapters.api.dto;

import org.jane.morajaati.chapters.domain.model.NewCourseChapter;

import java.util.UUID;

public record CreateChapterRequestDto(
        String title,
        String description,
        UUID thumbnail
) {
    public NewCourseChapter toModel() {
        return new NewCourseChapter(title, description, thumbnail);
    }
}
