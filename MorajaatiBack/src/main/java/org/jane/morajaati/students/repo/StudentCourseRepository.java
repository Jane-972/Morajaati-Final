package org.jane.morajaati.students.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface StudentCourseRepository extends JpaRepository<StudentCourseEntity, StudentCourseId> {
    List<StudentCourseEntity> findByStudent_Id(UUID studentId);

    List<StudentCourseEntity> findByCourse_Id(UUID courseId);

    int countByCourse_Id(UUID courseId);

    @Query("select count(distinct sc.student.id) from StudentCourseEntity sc where sc.course.professorId = :professorId")
    int countDistinctStudentsByProfessorId(@Param("professorId") UUID professorId);

    @Query("select sc from StudentCourseEntity sc where sc.course.professorId = :professorId ORDER BY sc.joinedAt")
    List<StudentCourseEntity> findStudentsByProfessorId(@Param("professorId") UUID professorId);
}
