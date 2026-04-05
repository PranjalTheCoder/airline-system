create table if not exists users (
    id char(36) not null primary key,
    email varchar(320) not null,
    password_hash varchar(255) not null,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    phone varchar(30) null,
    date_of_birth date null,
    passport_number varchar(50) null,
    nationality varchar(100) null,
    profile_image varchar(500) null,
    role varchar(20) not null,
    status varchar(20) not null,
    email_verified bit not null default b'0',
    created_at datetime(6) not null,
    updated_at datetime(6) not null,
    last_login_at datetime(6) null,
    constraint uk_users_email unique (email)
);

create index idx_users_role on users(role);
create index idx_users_status on users(status);
