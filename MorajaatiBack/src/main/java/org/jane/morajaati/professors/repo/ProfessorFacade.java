package org.jane.morajaati.professors.repo;

import org.jane.morajaati.common.exception.ResourceNotFoundException;
import org.jane.morajaati.professors.domain.model.ProfessorModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ProfessorFacade {
    private final ProfessorRepo professorRepo;

    public ProfessorFacade(ProfessorRepo professorRepo) {
        this.professorRepo = professorRepo;
    }

    public List<ProfessorModel> getAllProfessors() {
        return professorRepo.findAllTeachers()
                .stream()
                .map(ProfessorEntity::toProfessorModel)
                .toList();
    }

    public ProfessorModel getProfessorById(UUID professorId) {
        return professorRepo.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"))
                .toProfessorModel();
    }

    public List<ProfessorModel> getAllProfessorsByIds(Set<UUID> courseProfessorIds) {
        return professorRepo.findAllTeachersByIds(courseProfessorIds)
                .stream()
                .map(ProfessorEntity::toProfessorModel)
                .toList();
    }
}
