CREATE TABLE IF NOT EXISTS course_chapters
(
    id          UUID PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    course_id   UUID REFERENCES courses (id),
    created_at  TIMESTAMP    NOT NULL
)