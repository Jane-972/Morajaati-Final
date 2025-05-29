package org.jane.morajaati.courses.domain.model;

import org.jane.morajaati.professors.domain.model.ProfessorModel;

public record CourseWithProfessorAndEnrollment(
        Course course,
        ProfessorModel professor,
        CourseEnrollment enrollmentInfo
) {

}
