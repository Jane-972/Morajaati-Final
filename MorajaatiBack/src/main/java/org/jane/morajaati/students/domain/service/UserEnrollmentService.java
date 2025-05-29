package org.jane.morajaati.students.domain.service;

import org.jane.morajaati.students.domain.model.StudentCourseEnrollment;
import org.jane.morajaati.students.repo.EnrollmentStorageFacade;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.stream.Stream;

@Service
public class UserEnrollmentService {
    private final EnrollmentStorageFacade enrollmentStorageFacade;

    public UserEnrollmentService(EnrollmentStorageFacade enrollmentStorageFacade) {
        this.enrollmentStorageFacade = enrollmentStorageFacade;
    }

    public void enroll(UUID studentId, UUID courseId) {
        enrollmentStorageFacade.enrollStudent(studentId, courseId);
    }

    public Stream<StudentCourseEnrollment> getEnrolledStudentsByCourse(UUID courseId) {
        return enrollmentStorageFacade.getStudentsForCourse(courseId);
    }

    public Stream<StudentCourseEnrollment> getEnrolledStudentsByProfessor(UUID professorId) {
        return enrollmentStorageFacade.getStudentsByProfessor(professorId);
    }
}
