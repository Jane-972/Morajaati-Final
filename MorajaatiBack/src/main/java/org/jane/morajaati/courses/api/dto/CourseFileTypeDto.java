package org.jane.morajaati.courses.api.dto;

import org.jane.morajaati.documents.domain.model.FileType;

// TODO: Keep?
public enum CourseFileTypeDto {
    THUMBNAIL(FileType.THUMBNAIL),
    IMAGE(FileType.IMAGE),
    VIDEO(FileType.VIDEO),
    PDF(FileType.PDF);

    final FileType fileType;

    CourseFileTypeDto(FileType fileType) {
        this.fileType = fileType;
    }

    public FileType getFileType() {
        return fileType;
    }
}
