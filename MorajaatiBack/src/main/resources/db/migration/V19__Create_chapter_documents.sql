CREATE TABLE chapter_documents (
                       id UUID PRIMARY KEY,
                       file_name VARCHAR(255),
                       chapter_id UUID NOT NULL REFERENCES course_chapters(id) ON DELETE CASCADE,
                       document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
                       created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
