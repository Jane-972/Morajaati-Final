package org.jane.morajaati.professors.api.dto;

import org.jane.morajaati.courses.api.dto.CoursePriceDto;
import org.jane.morajaati.courses.domain.model.Course;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProfessorCourseOutputDTO(
        UUID id,
        String title,
        String description,
        @Nullable Double rating,
        int numberOfReviews,
        CoursePriceDto price,
        UUID thumbnail,
        LocalDateTime uploadDate
) {
    public static ProfessorCourseOutputDTO fromModel(Course course) {
        return new ProfessorCourseOutputDTO(
                course.id(),
                course.title(),
                course.description(),
                course.rating(),
                course.numberOfReviews(),
                CoursePriceDto.fromModel(course.price()),
                course.thumbnail(),
                course.uploadDate()
        );
    }
}
