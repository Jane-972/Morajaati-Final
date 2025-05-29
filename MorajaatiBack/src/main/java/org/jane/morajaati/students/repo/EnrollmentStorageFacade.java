package org.jane.morajaati.students.repo;

import org.jane.morajaati.courses.repo.course.CourseRepo;
import org.jane.morajaati.students.domain.model.StudentCourseEnrollment;
import org.jane.morajaati.users.repo.UserRepo;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.stream.Stream;


@Component
public class EnrollmentStorageFacade {
    private final StudentCourseRepository repository;
    private final UserRepo userRepository;
    private final CourseRepo courseRepository;

    public EnrollmentStorageFacade(StudentCourseRepository repository,
                                   UserRepo userRepository,
                                   CourseRepo courseRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public void enrollStudent(UUID studentId, UUID courseId) {
        var student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        var course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        var enrollment = new StudentCourseEntity(student, course);
        repository.save(enrollment);
    }

    public Stream<StudentCourseEnrollment> getCoursesForStudent(UUID studentId) {
        return repository.findByStudent_Id(studentId)
                .stream()
                .map(StudentCourseEntity::toModel);
    }

    public int countStudentsForCourse(UUID courseId) {
        return repository.countByCourse_Id(courseId);
    }
    public Stream<StudentCourseEnrollment> getStudentsForCourse(UUID courseId) {
        return repository.findByCourse_Id(courseId)
                .stream()
                .map(StudentCourseEntity::toModel);
    }

    public Stream<StudentCourseEnrollment> getStudentsByProfessor(UUID professorId) {
        return repository.findStudentsByProfessorId(professorId)
                .stream()
                .map(StudentCourseEntity::toModel);
    }
}
