package org.jane.morajaati.students.domain.service;

import org.jane.morajaati.courses.domain.service.CourseService;
import org.jane.morajaati.professors.domain.service.ProfessorService;
import org.jane.morajaati.students.domain.model.StudentCourseEnrollmentWithInfo;
import org.jane.morajaati.students.repo.EnrollmentStorageFacade;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.stream.Stream;

@Service
public class StudentService {
    private final EnrollmentStorageFacade enrollmentStorageFacade;
    private final ProfessorService professorService;
    private final CourseService courseService;

    public StudentService(EnrollmentStorageFacade enrollmentStorageFacade, ProfessorService professorService, CourseService courseService) {
        this.enrollmentStorageFacade = enrollmentStorageFacade;
        this.professorService = professorService;
        this.courseService = courseService;
    }

    public Stream<StudentCourseEnrollmentWithInfo> getEnrolledCourses(UUID studentId) {
        return enrollmentStorageFacade.getCoursesForStudent(studentId)
                .map(info -> {
                    var professor = professorService.getProfessor(info.course().professorId());
                    var courseStats = courseService.getCourseStats(info.course().id());
                    return new StudentCourseEnrollmentWithInfo(info.course(), professor, courseStats, info.enrollment());
                });
    }
}
