package org.jane.morajaati.students.api.dto;

import org.jane.morajaati.students.domain.model.EnrollmentInfo;

import java.time.LocalDateTime;

public record EnrollmentInfoDto(
        LocalDateTime enrollmentDate
) {
    public static EnrollmentInfoDto fromModel(EnrollmentInfo model) {
        return new EnrollmentInfoDto(model.enrollmentDate());
    }
}
