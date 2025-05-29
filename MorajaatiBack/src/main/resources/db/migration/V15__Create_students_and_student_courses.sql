-- students table (inherits from users)
CREATE TABLE students (
                          id UUID PRIMARY KEY REFERENCES users(id)
);

-- join table for student-course many-to-many
CREATE TABLE student_courses (
                             student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
                             course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
                             PRIMARY KEY (student_id, course_id)
);
