package org.jane.morajaati.documents.domain.model;

public enum FileType {
    THUMBNAIL("thumbnail"),
    IMAGE("image"),
    VIDEO("video"),
    PDF("pdf");

    private final String folder;

    FileType(String folder) {
        this.folder = folder;
    }

    public String getFolder() {
        return folder;
    }
}
