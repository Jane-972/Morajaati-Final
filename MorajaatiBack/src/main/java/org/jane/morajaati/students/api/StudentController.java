package org.jane.morajaati.students.api;

import org.jane.morajaati.students.domain.service.StudentService;
import org.jane.morajaati.users.api.dto.StudentCourseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.UUID;
import java.util.stream.Stream;


@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/me/courses")
    public Stream<StudentCourseDto> getMyCourses(Principal principal) {
        UUID studentId = UUID.fromString(principal.getName());
        return studentService.getEnrolledCourses(studentId)
                .map(StudentCourseDto::fromModel);
    }
}
