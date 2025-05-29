CREATE TABLE courses (
                     id UUID PRIMARY KEY,
                     title VARCHAR(255) NOT NULL,
                     description TEXT,
                     upload_date TIMESTAMP NOT NULL,
                     professor_id UUID,  -- Reference to the professor teaching the course
                     CONSTRAINT fk_professor FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE
);

