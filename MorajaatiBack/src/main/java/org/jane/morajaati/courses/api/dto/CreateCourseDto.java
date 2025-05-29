package org.jane.morajaati.courses.api.dto;

import jakarta.validation.constraints.NotNull;
import org.jane.morajaati.courses.domain.model.NewCourse;

public record CreateCourseDto(
        @NotNull(message = "Title must not be null")
        String title,
        @NotNull(message = "Description must not be null")
        String description,
        @NotNull(message = "Price must not be null")
        CoursePriceDto price
) {
    public NewCourse toModel() {
        return new NewCourse(title, description, price.toModel());
    }
}
