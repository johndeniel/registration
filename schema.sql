CREATE TABLE senior (
    id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
    firstname VARCHAR(255), -- First name
    middlename VARCHAR(255), -- Middle name
    lastname VARCHAR(255), -- Last name
    sex VARCHAR(10), -- Sex (e.g., Male, Female, etc.)
    dateofbirth DATE, -- Date of birth
    placeofbirth VARCHAR(255), -- Place of birth
    civilstatus VARCHAR(50), -- Civil status (e.g., Single, Married, etc.)
    education VARCHAR(255), -- Educational attainment
    occupation VARCHAR(255), -- Occupation
    barangay VARCHAR(255), -- Barangay (community/village)
    name VARCHAR(255), -- Name of contact (e.g., guardian, family member)
    relationship VARCHAR(50), -- Relationship to the senior (e.g., Son, Daughter)
    contact VARCHAR(15), -- Contact number
    health VARCHAR(255) -- Health condition or status
);

CREATE TABLE auth (
    id SERIAL PRIMARY KEY,         -- Automatically generates unique integer IDs
    username VARCHAR(255) NOT NULL, -- Username field, up to 255 characters, required
    password VARCHAR(255) NOT NULL  -- Password field, up to 255 characters, required
);

INSERT INTO auth (username, password) 
VALUES ('user1', '$2b$10$j1BFG4hR07qGvKs6cc4jE.kJl5Ko3eRhBl3pbMCwIH8DJiRSFYYgW');