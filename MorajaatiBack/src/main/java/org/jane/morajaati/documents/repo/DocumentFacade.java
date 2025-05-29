package org.jane.morajaati.documents.repo;

import org.jane.morajaati.common.exception.ResourceNotFoundException;
import org.jane.morajaati.documents.domain.model.Document;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DocumentFacade {
    private final DocumentRepo documentRepo;

    public DocumentFacade(DocumentRepo documentRepo) {
        this.documentRepo = documentRepo;
    }

    public Document getDocument(UUID id) {
        return documentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"))
                .toModel();
    }

    public void save(Document document) {
        documentRepo.save(DocumentEntity.from(document));
    }
}
