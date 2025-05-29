package org.jane.morajaati.documents.domain.service;

import jakarta.transaction.Transactional;
import org.jane.morajaati.common.exception.BadRequestException;
import org.jane.morajaati.common.exception.ResourceNotFoundException;
import org.jane.morajaati.common.exception.StorageFailureException;
import org.jane.morajaati.documents.domain.model.Document;
import org.jane.morajaati.documents.domain.model.FileType;
import org.jane.morajaati.documents.repo.DocumentEntity;
import org.jane.morajaati.documents.repo.DocumentFacade;
import org.jane.morajaati.documents.repo.DocumentRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;


@Service
public class DocumentService {
    private final DocumentFacade documentFacade;
    private final DocumentRepo documentRepo;

    @Value("${file.upload-dir}")
    private String uploadDir;
    private final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    public DocumentService(DocumentFacade documentFacade, DocumentRepo documentRepo) {
        this.documentFacade = documentFacade;
      this.documentRepo = documentRepo;
    }

    @Transactional
    public Document saveDocument(UUID userId, FileType fileType, MultipartFile file) {
        try {
            // Create the document entity
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path path;
            try {
                path = buildPath(userId, fileType, fileName);
                failIfDirectoryTraversal(path.toString());
                path.toFile().getParentFile().mkdirs(); // Create all parent folders if not existing
            } catch (Exception e) {
                throw new BadRequestException("Invalid file name " + file.getOriginalFilename());
            }

            Document document = new Document(
                    UUID.randomUUID(),
                    userId,
                    file.getOriginalFilename(),
                    path.toString(),
                    LocalDateTime.now(),
                    fileType,
                    file.getContentType()
            );

            // Save the document to the database
            documentFacade.save(document);
            logger.debug("Document saved successfully to DB");
            System.out.println("Document saved successfully to DB");

            // Store the file
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            logger.info("File saved to: {}", path);
            return document;
        } catch (IOException e) {
            throw new StorageFailureException("Error uploading file: " + e.getMessage());
        }
    }

    // Copied from https://stackoverflow.com/questions/2375903/whats-the-best-way-to-defend-against-a-path-traversal-attack
    public void failIfDirectoryTraversal(String relativePath) {
        File file = new File(relativePath);

        if (file.isAbsolute()) {
            throw new RuntimeException("Directory traversal attempt - absolute path not allowed");
        }

        String pathUsingCanonical;
        String pathUsingAbsolute;
        try {
            pathUsingCanonical = file.getCanonicalPath();
            pathUsingAbsolute = file.getAbsolutePath();
        } catch (IOException e) {
            throw new BadRequestException("Invalid file name");
        }


        // Require the absolute path and canonicalized path match.
        // This is done to avoid directory traversal
        // attacks, e.g. "1/../2/"
        if (!pathUsingCanonical.equals(pathUsingAbsolute)) {
            throw new BadRequestException("Invalid file name");
        }
    }

    public File retrieveFile(UUID fileId) {
        Document document = documentFacade.getDocument(fileId);
        String filePath = document.fileUrl();
        System.out.println("Trying to load file at path: " + filePath);  // <-- log here

        File file = Paths.get(filePath).toFile();
        if (file.exists()) {
            return file;
        } else {
            System.err.println("File does NOT exist at path: " + filePath);  // <-- log missing file
            throw new ResourceNotFoundException("Unable to find file " + file.getName());
        }
    }
    public DocumentEntity getDocumentById(UUID documentId) {
        return documentRepo.findById(documentId)
          .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }


    private Path buildPath(UUID userId, FileType type, String fileName) {
        return Paths.get(uploadDir, userId.toString(), type.getFolder(), fileName);
    }

    public Document getDocument(UUID documentId) {
        return documentFacade.getDocument(documentId);
    }
}
