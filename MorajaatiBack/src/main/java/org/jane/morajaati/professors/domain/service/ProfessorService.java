package org.jane.morajaati.professors.domain.service;

import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.courses.repo.course.CourseFacade;
import org.jane.morajaati.professors.domain.model.ProfessorModel;
import org.jane.morajaati.professors.repo.ProfessorFacade;
import org.jane.morajaati.students.domain.model.StudentCourseEnrollment;
import org.jane.morajaati.students.domain.service.UserEnrollmentService;
import org.jane.morajaati.users.domain.model.UserModel;
import org.jane.morajaati.users.domain.service.UserService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class ProfessorService {
    private final ProfessorFacade professorFacade;
    private final CourseFacade courseFacade;
    private final UserService userService;
    private final UserEnrollmentService enrollmentService;

    public ProfessorService(ProfessorFacade professorFacade, CourseFacade courseFacade, UserService userService, UserEnrollmentService enrollmentService) {
        this.courseFacade = courseFacade;
        this.professorFacade = professorFacade;
        this.userService = userService;
        this.enrollmentService = enrollmentService;
    }

    public List<ProfessorModel> getAllProfessors() {
        // Fetch all professors from the repository
        return professorFacade.getAllProfessors();
    }

    public ProfessorModel getProfessor(UUID professorId) {
        return professorFacade.getProfessorById(professorId);
    }

    public List<Course> getCoursesByProfessorId(UUID professorId) {
        // Fetch courses for a professor based on their ID
        return courseFacade.findProfessorCourses(professorId);
    }

    public int countCoursesByProfessor(UUID professorId) {
        return courseFacade.countCoursesByProfessorId(professorId);
    }

    public int countStudentsByProfessor(UUID professorId) {
        return courseFacade.countStudentsByProfessorId(professorId);
    }

    public Stream<StudentCourseEnrollment> getStudents(Principal principal) {
        UserModel currentUser = userService.getCurrentUser(principal);

        return enrollmentService.getEnrolledStudentsByProfessor(currentUser.id());
    }
}
