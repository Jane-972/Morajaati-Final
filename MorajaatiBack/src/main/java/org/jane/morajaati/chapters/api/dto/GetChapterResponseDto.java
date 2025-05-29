package org.jane.morajaati.chapters.api.dto;

import org.jane.morajaati.chapters.domain.model.CourseChapter;

import java.time.LocalDateTime;
import java.util.UUID;

public record GetChapterResponseDto(
        UUID id,
        UUID courseId,
        String title,
        String description,
        LocalDateTime createdAt
) {

    public static GetChapterResponseDto fromModel(CourseChapter courseChapter) {
        return new GetChapterResponseDto(
                courseChapter.id(),
                courseChapter.courseId(),
                courseChapter.title(),
                courseChapter.description(),
                courseChapter.createdAt()
        );
    }
}
