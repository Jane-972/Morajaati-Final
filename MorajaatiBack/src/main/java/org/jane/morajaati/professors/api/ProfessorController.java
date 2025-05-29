package org.jane.morajaati.professors.api;


import org.jane.morajaati.professors.api.dto.EnrolledStudentCourseOutputDto;
import org.jane.morajaati.professors.api.dto.ProfessorCourseOutputDTO;
import org.jane.morajaati.professors.api.dto.ProfessorOutputDTO;
import org.jane.morajaati.professors.domain.model.ProfessorModel;
import org.jane.morajaati.professors.domain.service.ProfessorService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/professors")

public class ProfessorController {
    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping
    public List<ProfessorOutputDTO> getAllProfessors() {
        return professorService.getAllProfessors()
                .stream()
                .map(ProfessorOutputDTO::fromModel)
                .toList();
    }

    @GetMapping("/{id}")
    public ProfessorModel getProfessor(@PathVariable UUID id) {
        return professorService.getProfessor(id);
    }




    @GetMapping("/{id}/courses")
    public List<ProfessorCourseOutputDTO> getCoursesByProfessor(@PathVariable UUID id) {
        return professorService.getCoursesByProfessorId(id)
                .stream()
                .map(ProfessorCourseOutputDTO::fromModel)
                .toList();
    }

    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    @GetMapping("/me/courses")
    public List<ProfessorCourseOutputDTO> getCoursesByProfessor(Principal principal) {
        UUID currentUserId = UUID.fromString(principal.getName());

        return professorService.getCoursesByProfessorId(currentUserId)
                .stream()
                .map(ProfessorCourseOutputDTO::fromModel)
                .toList();
    }

    @GetMapping("/me/students")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public List<EnrolledStudentCourseOutputDto> getStudents(Principal principal) {
        return professorService
          .getStudents(principal)
          .map(EnrolledStudentCourseOutputDto::fromModel)
          .collect(Collectors.toList());
    }


    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    @GetMapping("/me/courses/count")
    public int getNumberOfCoursesForProfessor(Principal principal) {
        UUID professorId = UUID.fromString(principal.getName());
        return professorService.countCoursesByProfessor(professorId);
    }

    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    @GetMapping("/me/students/count")
    public int getNumberOfStudentsForProfessor(Principal principal) {
        UUID professorId = UUID.fromString(principal.getName());
        return professorService.countStudentsByProfessor(professorId);
    }
}
