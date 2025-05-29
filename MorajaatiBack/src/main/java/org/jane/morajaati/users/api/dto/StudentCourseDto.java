package org.jane.morajaati.users.api.dto;

import org.jane.morajaati.courses.api.dto.CourseInfoOutputDto;
import org.jane.morajaati.courses.api.dto.CourseStatisticsOutputDto;
import org.jane.morajaati.professors.api.dto.ProfessorOutputDTO;
import org.jane.morajaati.students.api.dto.EnrollmentInfoDto;
import org.jane.morajaati.students.domain.model.StudentCourseEnrollmentWithInfo;

public record StudentCourseDto(
        CourseInfoOutputDto courseInfo,
        ProfessorOutputDTO professor,
        CourseStatisticsOutputDto courseStatistics,
        EnrollmentInfoDto studentEnrollment
) {
    public static StudentCourseDto fromModel(StudentCourseEnrollmentWithInfo model) {
        return new StudentCourseDto(
                CourseInfoOutputDto.fromModel(model.course()),
                ProfessorOutputDTO.fromModel(model.professor()),
                CourseStatisticsOutputDto.fromModel(model.courseStats()),
                EnrollmentInfoDto.fromModel(model.enrollment())
        );
    }
}
