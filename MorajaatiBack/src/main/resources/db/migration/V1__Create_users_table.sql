CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       first_name VARCHAR(255) NOT NULL,
                       last_name VARCHAR(255) NOT NULL,
                       email    VARCHAR(255) NOT NULL,
                       password VARCHAR(255) NOT NULL
);
