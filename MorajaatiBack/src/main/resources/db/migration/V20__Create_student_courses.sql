CREATE TABLE student_courses (
                         student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                         course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
                         joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
                         PRIMARY KEY (student_id, course_id)
);
