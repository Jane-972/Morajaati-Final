CREATE TABLE documents (
                       id UUID PRIMARY KEY,
                       course_id UUID,
                       file_name VARCHAR(255) NOT NULL,
                       file_url VARCHAR(255) NOT NULL,  -- URL to the document file
                       uploaded_date TIMESTAMP NOT NULL,
                       CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
