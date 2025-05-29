package org.jane.morajaati.courses.api.dto;

import org.jane.morajaati.courses.domain.model.CourseEnrollment;

public record CourseStatisticsOutputDto(
        int numberOfEnrolledStudents
) {
    public static CourseStatisticsOutputDto fromModel(CourseEnrollment courseEnrollment) {
        return new CourseStatisticsOutputDto(courseEnrollment.numberEnrolledStudent());
    }
}
