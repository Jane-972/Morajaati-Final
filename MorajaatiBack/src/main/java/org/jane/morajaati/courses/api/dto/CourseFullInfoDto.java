package org.jane.morajaati.courses.api.dto;

import org.jane.morajaati.courses.domain.model.CourseWithProfessorAndEnrollment;
import org.jane.morajaati.professors.api.dto.ProfessorOutputDTO;

public record CourseFullInfoDto(
        CourseInfoOutputDto courseInfo,
        ProfessorOutputDTO professor,
        CourseStatisticsOutputDto courseStatistics
) {
    public static CourseFullInfoDto fromModel(CourseWithProfessorAndEnrollment courseInfo) {
        return new CourseFullInfoDto(
                CourseInfoOutputDto.fromModel(courseInfo.course()),
                ProfessorOutputDTO.fromModel(courseInfo.professor()),
                CourseStatisticsOutputDto.fromModel(courseInfo.enrollmentInfo())
        );
    }
}
