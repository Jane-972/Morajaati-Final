package org.jane.morajaati.professors.api.dto;

import org.jane.morajaati.students.api.dto.EnrollmentInfoDto;
import org.jane.morajaati.students.domain.model.StudentCourseEnrollment;
import org.jane.morajaati.users.api.dto.UserOutputDTO;

public record EnrolledStudentCourseOutputDto(
        UserOutputDTO student,
        ProfessorCourseOutputDTO course,
        EnrollmentInfoDto enrollment
) {
    public static EnrolledStudentCourseOutputDto fromModel(StudentCourseEnrollment model) {
        return new EnrolledStudentCourseOutputDto(
                UserOutputDTO.fromModel(model.student()),
                ProfessorCourseOutputDTO.fromModel(model.course()),
                EnrollmentInfoDto.fromModel(model.enrollment())
        );
    }
}
