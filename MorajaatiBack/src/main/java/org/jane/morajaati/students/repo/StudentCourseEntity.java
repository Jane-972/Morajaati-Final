package org.jane.morajaati.students.repo;

import jakarta.persistence.*;
import org.jane.morajaati.courses.repo.course.CourseEntity;
import org.jane.morajaati.students.domain.model.EnrollmentInfo;
import org.jane.morajaati.students.domain.model.StudentCourseEnrollment;
import org.jane.morajaati.users.repo.UserEntity;

import java.time.LocalDateTime;


@Entity
@Table(name = "student_courses")
public class StudentCourseEntity {
  @EmbeddedId
  private StudentCourseId id;

  @ManyToOne
  @MapsId("studentId")
  @JoinColumn(name = "student_id")
  private UserEntity student;

  @ManyToOne
  @MapsId("courseId")
  @JoinColumn(name = "course_id")
  private CourseEntity course;

  private LocalDateTime joinedAt;

  public StudentCourseEntity() {
  }

  public StudentCourseEntity(UserEntity student, CourseEntity course) {
    this.id = new StudentCourseId(student.getId(), course.getId());
    this.student = student;
    this.course = course;
    this.joinedAt = LocalDateTime.now();
  }

  public StudentCourseEnrollment toModel() {
    return new StudentCourseEnrollment(
            student.toModel(),
            course.toModel(),
            new EnrollmentInfo(joinedAt)
    );
  }
}
