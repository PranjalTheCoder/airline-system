create table if not exists auth_audit_logs (
    id char(36) not null primary key,
    user_id char(36) null,
    event_type varchar(50) not null,
    email varchar(320) null,
    ip_address varchar(64) null,
    user_agent varchar(500) null,
    metadata json null,
    created_at datetime(6) not null,
    constraint fk_auth_audit_logs_user foreign key (user_id) references users(id)
);

create index idx_auth_audit_logs_user_id on auth_audit_logs(user_id);
create index idx_auth_audit_logs_event_type on auth_audit_logs(event_type);
create index idx_auth_audit_logs_created_at on auth_audit_logs(created_at);
