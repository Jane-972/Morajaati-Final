package org.jane.morajaati.chapters.repo;

import org.jane.morajaati.chapters.domain.model.CourseChapter;
import org.jane.morajaati.chapters.domain.model.NewCourseChapter;
import org.jane.morajaati.common.exception.ResourceNotFoundException;
import org.jane.morajaati.common.service.UuidGenerator;
import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.courses.repo.course.CourseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class ChapterStorageFacade {
    private final ChapterRepository chapterRepository;
    private final UuidGenerator uuidGenerator;


    public CourseChapter getChapterById(UUID id) {
        return chapterRepository.findById(id)
          .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"))
          .toModel();
    }

    public ChapterStorageFacade(ChapterRepository chapterRepository, UuidGenerator uuidGenerator) {
        this.chapterRepository = chapterRepository;
        this.uuidGenerator = uuidGenerator;
    }

    public CourseChapter save(Course course, NewCourseChapter newChapter) {
        ChapterEntity newEntity = chapterRepository.save(new ChapterEntity(
                uuidGenerator.generateId(),
                course.id(),
                newChapter.title(),
                newChapter.description(),
                LocalDateTime.now(),
                newChapter.thumbnail()
          )
        );

        return newEntity.toModel();
    }
    public void updateChapterThumbnail(CourseChapter chapter, UUID thumbnailId) {
        ChapterEntity entity = ChapterEntity.from(chapter);
        entity.setThumbnail(thumbnailId);
        chapterRepository.save(entity);
    }

    public Stream<CourseChapter> getAll(Course course) {
        return chapterRepository.findAllByCourseId(course.id())
                .stream()
                .map(ChapterEntity::toModel);
    }
}
