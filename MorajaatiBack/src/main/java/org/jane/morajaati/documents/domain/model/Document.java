package org.jane.morajaati.documents.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public record Document(
        UUID id,
        UUID userId,
        String fileUrl,
        String fileName,
        LocalDateTime uploadedDate,
        FileType type,
        String contentType
) {
}