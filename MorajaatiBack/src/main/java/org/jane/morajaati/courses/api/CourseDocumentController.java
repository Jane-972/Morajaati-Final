package org.jane.morajaati.courses.api;


import org.jane.morajaati.courses.api.dto.CourseDocumentOutputDTO;
import org.jane.morajaati.courses.api.dto.CourseFileTypeDto;
import org.jane.morajaati.courses.domain.service.CourseService;
import org.jane.morajaati.documents.domain.model.Document;
import org.jane.morajaati.video.api.VideoPlayer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
public class CourseDocumentController {
    private final Logger logger = LoggerFactory.getLogger(CourseDocumentController.class);
    private final CourseService courseService;
    private final VideoPlayer videoPlayer;

    public CourseDocumentController(CourseService courseService, VideoPlayer videoPlayer) {
        this.courseService = courseService;
        this.videoPlayer = videoPlayer;
    }

    //@PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/all/documents")
    public List<CourseDocumentOutputDTO> getAllCourseDocuments() {
        return courseService.getAllCourseDocuments()
                .stream()
                .map(CourseDocumentOutputDTO::fromModel)
                .toList();
    }

    //@PreAuthorize("hasAuthority('ROLE_TEACHER')")
    @GetMapping("/{courseId}/documents")
    public List<CourseDocumentOutputDTO> getCourseDocuments(
            Principal principal,
            @PathVariable UUID courseId
    ) {
        UUID currentUserId = UUID.fromString(principal.getName());

        return courseService.getCourseDocuments(currentUserId, courseId)
                .stream()
                .map(CourseDocumentOutputDTO::fromModel)
                .toList();
    }

    @GetMapping("/{courseId}/thumbnail")
    public ResponseEntity<Resource> downloadThumbnail(@PathVariable UUID courseId) {
        Resource thumbnail = courseService.getThumbnailResource(courseId);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // or IMAGE_PNG depending on your image type
                .body(thumbnail);
    }

   @GetMapping("/{courseId}/video/{videoId}")
    public ResponseEntity<StreamingResponseBody> streamCourseVideo(
            Principal principal,
            @PathVariable UUID courseId,
            @PathVariable UUID videoId,
            @RequestHeader(value = "Range", required = false) String httpRangeHeader
    ) {
        UUID currentUserId = UUID.fromString(principal.getName());
        logger.trace("Getting video for course  {} and video id {} and range {}", courseId, videoId, httpRangeHeader);
        Document videoDocument = courseService.getCourseVideo(currentUserId, videoId);
        return videoPlayer.streamVideo(videoDocument, httpRangeHeader);
    }

    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    @PostMapping("/{courseId}/upload/{type}")
    @ResponseStatus(HttpStatus.CREATED)
    public String uploadCourseFile(
            Principal principal,
            @PathVariable UUID courseId,
            @PathVariable CourseFileTypeDto type,
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String fileName
    ) {
        // Log the received request
        UUID currentUserId = UUID.fromString(principal.getName());
        logger.info("Received file upload request for file: {}", file.getOriginalFilename() + " by user: " + currentUserId);

        courseService.saveCourseFile(currentUserId, courseId, type.getFileType(), file, fileName);
        return "File uploaded successfully";
    }
}
