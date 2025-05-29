CREATE TABLE course_documents
(
    id          UUID PRIMARY KEY,
    name        VARCHAR(255),
    course_id   UUID
        constraint fk_course_id references courses (id) on delete cascade,
    document_id UUID
        constraint fk_document_id references documents (id) on delete cascade
);
