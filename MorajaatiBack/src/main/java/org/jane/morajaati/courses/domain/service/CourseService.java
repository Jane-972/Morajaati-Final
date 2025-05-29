package org.jane.morajaati.courses.domain.service;

import jakarta.transaction.Transactional;
import org.jane.morajaati.common.exception.ResourceNotFoundException;
import org.jane.morajaati.courses.domain.model.*;
import org.jane.morajaati.courses.repo.course.CourseFacade;
import org.jane.morajaati.courses.repo.document.CourseDocumentFacade;
import org.jane.morajaati.documents.domain.model.Document;
import org.jane.morajaati.documents.domain.model.FileType;
import org.jane.morajaati.documents.domain.service.DocumentService;
import org.jane.morajaati.professors.domain.service.ProfessorService;
import org.jane.morajaati.students.repo.EnrollmentStorageFacade;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.MalformedURLException;
import java.util.List;
import java.util.UUID;

@Service
public class CourseService {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final CourseFacade courseFacade;
    private final DocumentService documentService;
    private final CourseDocumentFacade courseDocumentFacade;
    private final EnrollmentStorageFacade enrollmentStorageFacade;
    private final ProfessorService professorService;

    public CourseService(CourseFacade courseFacade,
                         DocumentService documentService,
                         CourseDocumentFacade courseDocumentFacade, EnrollmentStorageFacade enrollmentStorageFacade, ProfessorService professorService) {
        this.courseFacade = courseFacade;
        this.documentService = documentService;
        this.courseDocumentFacade = courseDocumentFacade;
        this.enrollmentStorageFacade = enrollmentStorageFacade;
        this.professorService = professorService;
    }


    public List<CourseWithProfessorAndEnrollment> getAllCourses() {
        return courseFacade.getAllCoursesWithProfessors();
    }

    public CourseWithProfessorAndEnrollment getCourseInfo(UUID courseId) {
        Course course = courseFacade.getCourseById(courseId);
        var studentCount = enrollmentStorageFacade.countStudentsForCourse(course.id());
        var professor = professorService.getProfessor(course.professorId());

        return new CourseWithProfessorAndEnrollment(course, professor, new CourseEnrollment(studentCount));
    }

    public CourseEnrollment getCourseStats(UUID courseId) {
        var studentCount = enrollmentStorageFacade.countStudentsForCourse(courseId);

        return new CourseEnrollment(studentCount);
    }

    public Course getCourseById(UUID id) {
        return courseFacade.getCourseById(id);
    }

    public List<CourseDocument> getAllCourseDocuments() {
        return courseDocumentFacade.getAllDocuments();
    }

    public List<CourseDocument> getCourseDocuments(UUID currentUserId, UUID courseId) {
        // TODO: Check that teacher owns the course, or that student is subscribed
        Course course = courseFacade.getCourseById(courseId);

        return courseDocumentFacade.getCourseDocuments(course);
    }

    public Document getCourseVideo(UUID currentUserId, UUID videoId) {
        // TODO: Check that user has access to video/course
        Document videoDocument = documentService.getDocument(videoId);

        return videoDocument;
    }

    public UrlResource getThumbnailResource(UUID courseId) {
        Course course = courseFacade.getCourseById(courseId);

        if (course.thumbnail() == null) {
            throw new ResourceNotFoundException("This course has no thumbnail.");
        }

        File file = documentService.retrieveFile(course.thumbnail());

        try {
            return new UrlResource(file.toURI());
        } catch (MalformedURLException e) {
            throw new RuntimeException("Invalid file URL: " + file.getAbsolutePath(), e);
        }
    }


    public File getCourseThumbnail(UUID courseId) {
        Course course = courseFacade.getCourseById(courseId);

        return documentService.retrieveFile(course.thumbnail());
    }

    @Transactional
    public void saveCourseFile(UUID currentUserId, UUID courseId, FileType fileType, MultipartFile file, String fileName) {
        // Check the course
        Course course = courseFacade.getCourseById(courseId);

        Document storedDocument = documentService.saveDocument(currentUserId, fileType, file);

        if (fileType == FileType.THUMBNAIL) {
            courseFacade.updateCourseThumbnail(course, storedDocument.id());
        } else {
            courseDocumentFacade.storeFile(course, storedDocument, fileName);
            // TODO: Store course file
        }
    }

    public CourseWithProfessorAndEnrollment createCourse(UUID professorId, NewCourse course) {
        var professor = professorService.getProfessor(professorId);
        var newCourse = courseFacade.createCourse(professor, course);

        return new CourseWithProfessorAndEnrollment(
                newCourse,
                professor,
                new CourseEnrollment(0)
        );
    }
}
