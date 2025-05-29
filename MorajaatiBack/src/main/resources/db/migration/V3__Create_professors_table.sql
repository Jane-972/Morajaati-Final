CREATE TABLE professors (
                        id UUID PRIMARY KEY,
                        specialisation VARCHAR(255),
                        rating DOUBLE PRECISION,
                        description TEXT,
                        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);
