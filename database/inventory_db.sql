CREATE DATABASE inventory_db;

use inventory_db;


CREATE TABLE seat_maps (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    flight_id VARCHAR(20) NOT NULL,
    aircraft_model VARCHAR(50) NOT NULL,
    cabin_class VARCHAR(20) NOT NULL,

    total_rows INT,
    seat_layout VARCHAR(10),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_flight_cabin (flight_id, cabin_class)
);
CREATE TABLE seat_rows (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    seat_map_id BIGINT NOT NULL,
    row_num INT NOT NULL,

    is_exit_row BOOLEAN DEFAULT FALSE,
    is_bulkhead BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seat_map_id) REFERENCES seat_maps(id) ON DELETE CASCADE
);


CREATE TABLE seats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    seat_map_id BIGINT NOT NULL,
    row_id BIGINT NOT NULL,

    seat_number VARCHAR(10) NOT NULL,
    row_num INT NOT NULL,
    column_letter CHAR(1) NOT NULL,

    seat_type VARCHAR(20),       -- WINDOW / AISLE / STANDARD / PREMIUM
    seat_status VARCHAR(20),     -- AVAILABLE / HELD / BOOKED / BLOCKED

    price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'INR',

    version INT DEFAULT 0,       -- for optimistic locking

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (seat_map_id) REFERENCES seat_maps(id) ON DELETE CASCADE,
    FOREIGN KEY (row_id) REFERENCES seat_rows(id) ON DELETE CASCADE,

    UNIQUE KEY unique_seat (seat_map_id, seat_number)
);

CREATE TABLE seat_features (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    seat_id BIGINT NOT NULL,
    feature VARCHAR(50) NOT NULL,

    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

CREATE TABLE seat_pricing (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    seat_id BIGINT NOT NULL,

    base_price DECIMAL(10,2),
    tax DECIMAL(10,2),
    final_price DECIMAL(10,2),

    currency VARCHAR(10),
    pricing_type VARCHAR(20),   -- FIXED / DYNAMIC

    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

CREATE TABLE seat_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    seat_id BIGINT NOT NULL,

    old_status VARCHAR(20),
    new_status VARCHAR(20),

    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(50),

    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

CREATE TABLE seat_locks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    seat_id BIGINT NOT NULL,
    flight_id VARCHAR(20) NOT NULL,

    locked_by VARCHAR(50),
    lock_expiry TIMESTAMP,

    status VARCHAR(20),   -- ACTIVE / EXPIRED

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

CREATE INDEX idx_flight_id ON seat_maps(flight_id);
CREATE INDEX idx_seat_status ON seats(seat_status);
CREATE INDEX idx_seat_number ON seats(seat_number);
CREATE INDEX idx_lock_expiry ON seat_locks(lock_expiry);

-- Insert seat_map
INSERT INTO seat_maps (flight_id, aircraft_model, cabin_class, total_rows, seat_layout)
VALUES ('FL001', 'Boeing 787-9', 'ECONOMY', 33, '3-3');


INSERT INTO seat_maps (flight_id, aircraft_model, cabin_class, total_rows, seat_layout)
VALUES ('ZA503', 'Airbus A350-1000', 'ECONOMY', 33, '3-3');

SELECT seat_status FROM seats WHERE id = 'ZA503';

SELECT * FROM seat_maps;
SELECT * FROM seat_rows;
SELECT * FROM seats;
SELECT * FROM seat_features;
SELECT * FROM seat_pricing;
SELECT * FROM seat_status_history;
drop database inventory_db;
DELETE FROM seat_maps WHERE flight_id = 'ZA503';

DELETE FROM seats;
DELETE FROM seat_rows;
DELETE FROM seat_maps;

SELECT * FROM seats WHERE seat_number = '10A';
