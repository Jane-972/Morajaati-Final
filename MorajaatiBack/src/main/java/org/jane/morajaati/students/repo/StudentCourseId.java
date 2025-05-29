package org.jane.morajaati.students.repo;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class StudentCourseId implements Serializable {
  private UUID studentId;
  private UUID courseId;

  public StudentCourseId() {
  }

  public StudentCourseId(UUID studentId, UUID courseId) {
    this.studentId = studentId;
    this.courseId = courseId;
  }
}
