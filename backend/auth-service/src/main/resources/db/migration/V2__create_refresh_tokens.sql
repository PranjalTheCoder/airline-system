create table if not exists refresh_tokens (
    id char(36) not null primary key,
    user_id char(36) not null,
    token_hash varchar(255) not null,
    expires_at datetime(6) not null,
    revoked_at datetime(6) null,
    replaced_by_token_id char(36) null,
    created_at datetime(6) not null,
    created_ip varchar(64) null,
    user_agent varchar(500) null,
    constraint fk_refresh_tokens_user foreign key (user_id) references users(id)
);

create index idx_refresh_tokens_user_id on refresh_tokens(user_id);
create index idx_refresh_tokens_token_hash on refresh_tokens(token_hash);
create index idx_refresh_tokens_expires_at on refresh_tokens(expires_at);
