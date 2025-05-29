package org.jane.morajaati.documents.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DocumentRepo extends JpaRepository<DocumentEntity, UUID> {
}
