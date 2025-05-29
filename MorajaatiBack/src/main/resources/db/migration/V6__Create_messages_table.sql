CREATE TABLE messages (
                      id UUID PRIMARY KEY,
                      sender_id UUID REFERENCES users(id),
                      receiver_id UUID REFERENCES users(id),
                      content TEXT NOT NULL,
                      sent_at TIMESTAMP NOT NULL
);
