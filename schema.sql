CREATE TABLE auth (
    id SERIAL PRIMARY KEY,         -- Automatically generates unique integer IDs
    username VARCHAR(255) NOT NULL, -- Username field, up to 255 characters, required
    password VARCHAR(255) NOT NULL  -- Password field, up to 255 characters, required
);

INSERT INTO auth (username, password) 
VALUES ('user1', '$2b$10$j1BFG4hR07qGvKs6cc4jE.kJl5Ko3eRhBl3pbMCwIH8DJiRSFYYgW');