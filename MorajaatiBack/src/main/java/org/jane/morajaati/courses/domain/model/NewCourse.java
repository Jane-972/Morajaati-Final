package org.jane.morajaati.courses.domain.model;

public record NewCourse(
        String title,
        String description,
        CoursePrice price
) {
}
