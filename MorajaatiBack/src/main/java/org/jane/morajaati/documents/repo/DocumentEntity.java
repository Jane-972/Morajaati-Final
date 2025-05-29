package org.jane.morajaati.documents.repo;

import jakarta.persistence.*;
import org.jane.morajaati.documents.domain.model.Document;
import org.jane.morajaati.documents.domain.model.FileType;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "documents")
public class DocumentEntity {
    @Id
    private UUID id;
    private UUID userId;
    private String fileUrl;
    private String fileName;
    private LocalDateTime uploadedDate;
    @Enumerated(EnumType.STRING)
    protected FileType type;
    private String contentType;

    public DocumentEntity() {
    }

    public DocumentEntity(
            UUID id,
            UUID userId,
            String fileName,
            String fileUrl,
            LocalDateTime uploadedDate,
            FileType type,
            String contentType) {
        this.id = id;
        this.userId = userId;
        this.fileUrl = fileUrl;
        this.uploadedDate = uploadedDate;
        this.fileName = fileName;
        this.type = type;
        this.contentType = contentType;
    }

    public static DocumentEntity from(Document document) {
        return new DocumentEntity(
                document.id(),
                document.userId(),
                document.fileUrl(),
                document.fileName(),
                document.uploadedDate(),
                document.type(),
                document.contentType()
        );
    }

    public Document toModel() {
        return new Document(
                id,
                userId,
                fileUrl,
                fileName,
                uploadedDate,
                type,
                contentType
        );
    }

    public UUID getId() {
        return id;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public FileType getType() {
        return type;
    }

    public String getFileName() {
        return fileName;
    }

    public String getContentType() {
        return contentType;
    }
}
