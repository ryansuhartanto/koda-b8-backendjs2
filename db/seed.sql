BEGIN;

INSERT INTO users (name, email, password_hash)
VALUES
    -- password: 123
    ('John Doe', 'john@example.com', '$2b$10$7LMKWMUdLkQCUh2AZ3oZ5ek7ww07yqB5xA349CJhjVmg3/yrte.s6'),
    ('Jane Doe', 'jane@example.com', '$2b$10$L0gdqTFkmP1nwW0GQ1ycWuQ96knTv1ILSugSjY3g4133gGZl0Im1u');

INSERT INTO notes (id_user, title, body)
SELECT u.id, v.title, v.body
FROM (VALUES
    ('john@example.com', 'Groceries', 'milk, eggs, coffee'),
    ('jane@example.com', 'Standup notes', '')
) AS v (email, title, body)
JOIN users u ON u.email = v.email;

COMMIT;
