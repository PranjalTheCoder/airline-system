Use airline_auth;

CREATE TABLE users (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 username VARCHAR(50) UNIQUE NOT NULL,
 email VARCHAR(100) UNIQUE,
 password VARCHAR(255) NOT NULL,
 enabled BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE permissions (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE user_roles (
 user_id BIGINT,
 role_id BIGINT,
 PRIMARY KEY(user_id, role_id),
 FOREIGN KEY (user_id) REFERENCES users(id),
 FOREIGN KEY (role_id) REFERENCES roles(id)
);


DROP TABLE user_roles;

show tables;

CREATE TABLE user_roles (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 user_id BIGINT,
 role_id BIGINT,
 FOREIGN KEY (user_id) REFERENCES users(id),
 FOREIGN KEY (role_id) REFERENCES roles(id)
);

DELETE FROM users WHERE username='admin';

INSERT INTO roles(name) VALUES ('ADMIN');
INSERT INTO roles(name) VALUES ('PASSENGER');
INSERT INTO roles(name) VALUES ('AIRLINE_STAFF');
INSERT INTO roles (name) VALUES ('OPERATIONS_MANAGER');

INSERT INTO permissions(name) VALUES ('BOOK_FLIGHT');
INSERT INTO permissions(name) VALUES ('CANCEL_FLIGHT');
INSERT INTO permissions (name) VALUES ('VIEW_FLIGHTS');
INSERT INTO permissions(name) VALUES ('MANAGE_USERS');
INSERT INTO permissions (name) VALUES ('MANAGE_FLIGHTS');

SELECT * From roles;
SELECT * From permissions;