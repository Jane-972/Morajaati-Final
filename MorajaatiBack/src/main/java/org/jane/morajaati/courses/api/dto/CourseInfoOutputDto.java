package org.jane.morajaati.courses.api.dto;

import org.jane.morajaati.courses.domain.model.Course;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.util.UUID;

public record CourseInfoOutputDto(
        UUID id,
        String title,
        String description,
        @Nullable Double rating,
        int numberOfReviews,
        CoursePriceDto price,
        LocalDateTime uploadDate
) {
    public static CourseInfoOutputDto fromModel(Course course) {
        return new CourseInfoOutputDto(
                course.id(),
                course.title(),
                course.description(),
                course.rating(),
                course.numberOfReviews(),
                CoursePriceDto.fromModel(course.price()),
                course.uploadDate()
        );
    }
}
