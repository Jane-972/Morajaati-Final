package org.jane.morajaati.courses.api;


import jakarta.validation.Valid;
import org.jane.morajaati.courses.api.dto.CourseFullInfoDto;
import org.jane.morajaati.courses.api.dto.CreateCourseDto;
import org.jane.morajaati.courses.api.dto.EnrolledStudentOutputDto;
import org.jane.morajaati.courses.domain.service.CourseService;
import org.jane.morajaati.students.domain.service.UserEnrollmentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;
    private final UserEnrollmentService userEnrollmentService;

    public CourseController(CourseService courseService, UserEnrollmentService userEnrollmentService) {
        this.courseService = courseService;
        this.userEnrollmentService = userEnrollmentService;
    }

    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    @PostMapping
    public CourseFullInfoDto uploadCourse(
            Principal principal,
            @Valid @RequestBody CreateCourseDto requestDTO
    ) {
        UUID professorId = UUID.fromString(principal.getName());
        var newCourse = courseService.createCourse(professorId, requestDTO.toModel());
        return CourseFullInfoDto.fromModel(newCourse);
    }

    @GetMapping("/{courseId}")
    public CourseFullInfoDto getCourseInfo(@PathVariable UUID courseId) {
        var courseInfo = courseService.getCourseInfo(courseId);

        return CourseFullInfoDto.fromModel(courseInfo);
    }

    @GetMapping("/all")
    public List<CourseFullInfoDto> getAllCourses() {
        return courseService.getAllCourses()
                .stream()
                .sorted(Comparator.comparing(courseWithProf -> courseWithProf.course().rating(), Comparator.nullsLast(Comparator.reverseOrder())))
                .map(CourseFullInfoDto::fromModel)
                .toList();
    }

    @GetMapping("/{courseId}/students")
    public Stream<EnrolledStudentOutputDto> getStudents(@PathVariable UUID courseId) {
        return userEnrollmentService
                .getEnrolledStudentsByCourse(courseId)
                .map(EnrolledStudentOutputDto::fromModel);
    }
}
