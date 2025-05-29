package org.jane.morajaati.students.domain.model;

import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.courses.domain.model.CourseEnrollment;
import org.jane.morajaati.professors.domain.model.ProfessorModel;

public record StudentCourseEnrollmentWithInfo(
        Course course,
        ProfessorModel professor,
        CourseEnrollment courseStats,
        EnrollmentInfo enrollment
) {
}
