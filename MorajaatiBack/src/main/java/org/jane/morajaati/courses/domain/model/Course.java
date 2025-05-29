package org.jane.morajaati.courses.domain.model;

import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.util.UUID;

// TODO: Price should have currency
public record Course(
        UUID id,
        UUID professorId,
        String title,
        String description,
        int numberOfReviews,
        CoursePrice price,
        @Nullable Double rating,
        LocalDateTime uploadDate,
        UUID thumbnail
) {

}
