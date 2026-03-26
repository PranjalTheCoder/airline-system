CREATE DATABASE flight_db;

USE flight_db;

CREATE TABLE airlines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    airline_code VARCHAR(10) NOT NULL,
    airline_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    origin_code VARCHAR(10) NOT NULL,
    destination_code VARCHAR(10) NOT NULL,
    distance INT,
    duration_minutes INT
);

CREATE TABLE flights (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_number VARCHAR(20) NOT NULL,
    airline_id BIGINT,
    route_id BIGINT,
    aircraft_id VARCHAR(20),
    stops INT DEFAULT 0,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (airline_id) REFERENCES airlines(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

CREATE TABLE flight_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_id BIGINT,
    departure_time TIME,
    arrival_time TIME,
    days_of_operation VARCHAR(50),
    effective_from DATE,
    effective_to DATE,

    FOREIGN KEY (flight_id) REFERENCES flights(id)
);

CREATE TABLE flight_instances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_id BIGINT,
    schedule_id BIGINT,
    departure_datetime DATETIME,
    arrival_datetime DATETIME,
    status VARCHAR(20),
    gate VARCHAR(10),
    terminal VARCHAR(10),

    FOREIGN KEY (flight_id) REFERENCES flights(id),
    FOREIGN KEY (schedule_id) REFERENCES flight_schedules(id)
);

CREATE TABLE flight_amenities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_id BIGINT,
    amenity VARCHAR(100),

    FOREIGN KEY (flight_id) REFERENCES flights(id)
);

CREATE TABLE cabin_class_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_id BIGINT,
    class_type VARCHAR(20),
    base_price DECIMAL(10,2),
    currency VARCHAR(10),
    total_seats INT,
    available_seats INT,
    cabin_baggage VARCHAR(50),
    checked_baggage VARCHAR(50),

    FOREIGN KEY (flight_id) REFERENCES flights(id)
);

INSERT INTO airlines (name, airline_code, airline_type)
VALUES 
('SkyWay Airlines', 'SW', 'FSC'),
('Air India', 'AI', 'FSC');

INSERT INTO routes (origin_code, destination_code, distance, duration_minutes)
VALUES 
('JFK', 'LHR', 5567, 435),
('DEL', 'DXB', 2200, 210);

INSERT INTO flights (flight_number, airline_id, route_id, aircraft_id, stops, status)
VALUES
('SW101', 1, 1, 'AC001', 0, 'ACTIVE'),
('AI202', 2, 2, 'AC002', 0, 'ACTIVE');

INSERT INTO flight_schedules (flight_id, departure_time, arrival_time, days_of_operation, effective_from, effective_to)
VALUES
(1, '08:30:00', '20:45:00', 'MON,TUE,WED', '2026-01-01', '2026-12-31'),
(2, '10:00:00', '13:30:00', 'DAILY', '2026-01-01', '2026-12-31');

INSERT INTO flight_instances (flight_id, schedule_id, departure_datetime, arrival_datetime, status, gate, terminal)
VALUES
(1, 1, '2026-04-15 08:30:00', '2026-04-15 20:45:00', 'SCHEDULED', 'B12', 'T4'),
(1, 1, '2026-04-16 08:30:00', '2026-04-16 20:45:00', 'SCHEDULED', 'B13', 'T4'),
(2, 2, '2026-04-15 10:00:00', '2026-04-15 13:30:00', 'SCHEDULED', 'A2', 'T3');

INSERT INTO flight_amenities (flight_id, amenity)
VALUES
(1, 'Wi-Fi'),
(1, 'Meal Service'),
(1, 'USB Charging'),
(2, 'In-flight Entertainment');

INSERT INTO cabin_class_config 
(flight_id, class_type, base_price, currency, total_seats, available_seats, cabin_baggage, checked_baggage)
VALUES
(1, 'ECONOMY', 580, 'USD', 210, 142, '1 x 7kg', '1 x 23kg'),
(1, 'BUSINESS', 3800, 'USD', 42, 12, '2 x 10kg', '2 x 32kg');

SELECT * FROM airlines;
SELECT * FROM flights;
SELECT * FROM routes;
SELECT * FROM flight_instances;
SELECT * FROM cabin_class_config;

drop database flight_db;


UPDATE flight_instances
SET departure_datetime = '2026-04-15 08:30:00',
    arrival_datetime = '2026-04-15 20:45:00'
WHERE departure_datetime IS NULL;

SELECT * FROM flight_amenities;

SELECT * FROM flights WHERE route_id=2;
SELECT * FROM flight_instances WHERE flight_id = 2;

SELECT * FROM routes WHERE origin_code='DEL' AND destination_code='DXB';

UPDATE routes 
SET duration_minutes = 435 
WHERE origin_code = 'JFK' AND destination_code = 'LHR';

SELECT * FROM cabin_class_config;

INSERT INTO airlines (name, airline_code, airline_type)
VALUES 
('China Southern Airlines', 'CZ', 'FSC'),
('JetBlue Airways', 'B6', 'LCC');

INSERT INTO routes (origin_code, destination_code, distance, duration_minutes)
VALUES 
('PEK', 'SYD', 8934, 660),
('SYD', 'PEK', 9765, 875);

