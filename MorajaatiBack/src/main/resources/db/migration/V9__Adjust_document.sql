DROP TABLE documents;

create table documents
(
    id            uuid         not null
        primary key,
    user_id       uuid
        constraint fk_user_id references users (id) on delete cascade,
    file_name     varchar(255) not null,
    file_url      varchar(255) not null,
    uploaded_date timestamp    not null,
    type          varchar(255)
);
