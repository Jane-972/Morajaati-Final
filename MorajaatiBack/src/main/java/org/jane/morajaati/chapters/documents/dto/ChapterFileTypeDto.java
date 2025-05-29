package org.jane.morajaati.chapters.documents.dto;


import lombok.Getter;
import org.jane.morajaati.documents.domain.model.FileType;


@Getter
public enum ChapterFileTypeDto {
  THUMBNAIL(FileType.THUMBNAIL),
  IMAGE(FileType.IMAGE),
  VIDEO(FileType.VIDEO),
  PDF(FileType.PDF);

  final FileType fileType;

  ChapterFileTypeDto(FileType fileType) {
    this.fileType = fileType;
  }
}
