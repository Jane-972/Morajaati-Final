package org.jane.morajaati.chapters.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.jane.morajaati.chapters.domain.model.CourseChapter;
import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.courses.repo.course.CourseEntity;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "course_chapters")
public class ChapterEntity {
    @Id
    private UUID id;
    private UUID courseId;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private UUID thumbnail;


    public ChapterEntity() {
    }

    public ChapterEntity(UUID id, UUID courseId, String title, String description, LocalDateTime createdAt, UUID thumbnail) {
        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.thumbnail = thumbnail;
    }

    public CourseChapter toModel() {
        return new CourseChapter(id, courseId, title, description, createdAt, thumbnail);
    }

    public static ChapterEntity from(CourseChapter chapter) {
        return new ChapterEntity(chapter.id(),
          chapter.courseId(),
          chapter.title(),
          chapter.description(),
          chapter.createdAt(),
          chapter.thumbnail()
        );
    }
    public void setThumbnail(UUID thumbnail) {
        this.thumbnail = thumbnail;
    }
}
