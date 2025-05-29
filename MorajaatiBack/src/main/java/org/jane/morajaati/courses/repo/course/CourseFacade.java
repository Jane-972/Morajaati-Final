package org.jane.morajaati.courses.repo.course;

import org.jane.morajaati.common.exception.ResourceNotFoundException;
import org.jane.morajaati.common.service.UuidGenerator;
import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.courses.domain.model.CourseEnrollment;
import org.jane.morajaati.courses.domain.model.CourseWithProfessorAndEnrollment;
import org.jane.morajaati.courses.domain.model.NewCourse;
import org.jane.morajaati.professors.domain.model.ProfessorModel;
import org.jane.morajaati.professors.repo.ProfessorFacade;
import org.jane.morajaati.students.repo.EnrollmentStorageFacade;
import org.jane.morajaati.students.repo.StudentCourseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourseFacade {
    private final CourseRepo courseRepo;
    private final ProfessorFacade professorFacade;
    private final StudentCourseRepository studentCourseRepository;
    private final EnrollmentStorageFacade enrollmentStorageFacade;
    private final UuidGenerator uuidGenerator;


    public CourseFacade(CourseRepo courseRepo, ProfessorFacade professorFacade, StudentCourseRepository studentCourseRepository, EnrollmentStorageFacade enrollmentStorageFacade, UuidGenerator uuidGenerator) {
        this.courseRepo = courseRepo;
        this.professorFacade = professorFacade;
        this.studentCourseRepository = studentCourseRepository;
        this.enrollmentStorageFacade = enrollmentStorageFacade;
        this.uuidGenerator = uuidGenerator;
    }

    public List<Course> getAllCourses() {
        return courseRepo.findAll()
                .stream()
                .map(CourseEntity::toModel)
                .toList();
    }

    public List<CourseWithProfessorAndEnrollment> getAllCoursesWithProfessors() {
        List<Course> courses = getAllCourses();
        Set<UUID> courseProfessorIds = courses
                .stream()
                .map(Course::professorId)
                .collect(Collectors.toSet());

        Map<UUID, ProfessorModel> idToProfessor = professorFacade.getAllProfessorsByIds(courseProfessorIds)
                .stream()
                .collect(Collectors.toMap(ProfessorModel::id, item -> item));


        return courses.stream()
                .map(course -> {
                            var studentCount = enrollmentStorageFacade.countStudentsForCourse(course.id());

                            return new CourseWithProfessorAndEnrollment(
                                    course,
                                    idToProfessor.get(course.professorId()),
                                    new CourseEnrollment(studentCount)
                            );
                        }
                )
                .toList();
    }

    public Course getCourseById(UUID id) {
        return courseRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"))
                .toModel();
    }

    public void updateCourseThumbnail(Course course, UUID thumbnailId) {
        CourseEntity entity = CourseEntity.from(course);
        entity.setThumbnail(thumbnailId);
        courseRepo.save(entity);
    }

    public List<Course> findProfessorCourses(UUID professorId) {
        return courseRepo.findByProfessorId(professorId)
                .stream()
                .map(CourseEntity::toModel)
                .toList();
    }

    public int countCoursesByProfessorId(UUID professorId) {
        return courseRepo.countByProfessorId(professorId);
    }

    public int countStudentsByProfessorId(UUID professorId) {
        return studentCourseRepository.countDistinctStudentsByProfessorId(professorId);
    }

    public Course createCourse(ProfessorModel professor, NewCourse course) {
        var newCourseEntity = courseRepo.save(
                new CourseEntity(
                        uuidGenerator.generateId(),
                        professor.id(),
                        course.title(),
                        course.description(),
                        0.0,
                        0,
                        course.price().amount(),
                        course.price().currency().name(),
                        LocalDateTime.now()
                )
        );

        return newCourseEntity.toModel();
    }
}
