package org.jane.morajaati.students.domain.model;

import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.users.domain.model.UserModel;

public record StudentCourseEnrollment(
        UserModel student,
        Course course,
        EnrollmentInfo enrollment
) {
}
