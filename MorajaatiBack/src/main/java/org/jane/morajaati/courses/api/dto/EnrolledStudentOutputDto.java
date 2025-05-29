package org.jane.morajaati.courses.api.dto;

import org.jane.morajaati.students.api.dto.EnrollmentInfoDto;
import org.jane.morajaati.students.domain.model.StudentCourseEnrollment;
import org.jane.morajaati.users.api.dto.UserOutputDTO;

public record EnrolledStudentOutputDto(
        UserOutputDTO student,
        EnrollmentInfoDto enrollment
) {
    public static EnrolledStudentOutputDto fromModel(StudentCourseEnrollment model) {
        return new EnrolledStudentOutputDto(
                UserOutputDTO.fromModel(model.student()),
                EnrollmentInfoDto.fromModel(model.enrollment())
        );
    }
}
