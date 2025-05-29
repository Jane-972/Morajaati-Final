package org.jane.morajaati.video.api.dto;

import org.springframework.web.multipart.MultipartFile;

public record VideoUploadRequest(
         String description,
         MultipartFile file
){}