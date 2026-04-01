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

-- Insert Airlines
INSERT INTO airlines (name, airline_code, airline_type) VALUES
('SkyJet Airways', 'SJ101', 'Commercial'),
('BlueSky Airlines', 'BS202', 'Commercial'),
('Global Connect', 'GC303', 'International'),
('Air Horizon', 'AH404', 'Domestic'),
('StarFly', 'SF505', 'Commercial'),
('CloudNine Air', 'CN606', 'Charter'),
('TransWorld', 'TW707', 'International'),
('AeroLink', 'AL808', 'Domestic'),
('Sunrise Airlines', 'SR909', 'Commercial'),
('NovaJet', 'NJ010', 'Charter');

-- Insert Routes
INSERT INTO routes (origin_code, destination_code, distance, duration_minutes) VALUES
('DEL', 'BOM', 1150, 120),
('BLR', 'HYD', 500, 70),
('NYC', 'LON', 5567, 420),
('SFO', 'SEA', 1093, 130),
('DXB', 'SIN', 5840, 430),
('SYD', 'MEL', 713, 90),
('PAR', 'ROM', 1105, 150),
('BER', 'AMS', 650, 95),
('HKG', 'TYO', 2960, 240),
('JFK', 'MIA', 1757, 180);

-- Insert Flights
INSERT INTO flights (flight_number, airline_id, route_id, aircraft_id, stops, status) VALUES
('SJ101-DEL-BOM', 1, 1, 'A320', 0, 'Scheduled'),
('BS202-BLR-HYD', 2, 2, 'B737', 0, 'Scheduled'),
('GC303-NYC-LON', 3, 3, 'B787', 0, 'Scheduled'),
('AH404-SFO-SEA', 4, 4, 'A319', 0, 'Scheduled'),
('SF505-DXB-SIN', 5, 5, 'A350', 0, 'Scheduled'),
('CN606-SYD-MEL', 6, 6, 'B737', 0, 'Scheduled'),
('TW707-PAR-ROM', 7, 7, 'A320', 0, 'Scheduled'),
('AL808-BER-AMS', 8, 8, 'E190', 0, 'Scheduled'),
('SR909-HKG-TYO', 9, 9, 'B777', 0, 'Scheduled'),
('NJ010-JFK-MIA', 10, 10, 'A321', 0, 'Scheduled');

-- Insert Flight Schedules
INSERT INTO flight_schedules (flight_id, departure_time, arrival_time, days_of_operation, effective_from, effective_to) VALUES
(1, '08:00:00', '10:00:00', 'Mon,Wed,Fri', '2026-03-01', '2026-06-30'),
(2, '09:30:00', '10:40:00', 'Tue,Thu,Sat', '2026-03-01', '2026-06-30'),
(3, '18:00:00', '02:00:00', 'Daily', '2026-03-01', '2026-12-31'),
(4, '07:00:00', '09:10:00', 'Mon-Fri', '2026-03-01', '2026-06-30'),
(5, '22:00:00', '05:10:00', 'Daily', '2026-03-01', '2026-12-31'),
(6, '11:00:00', '12:30:00', 'Daily', '2026-03-01', '2026-06-30'),
(7, '14:00:00', '16:30:00', 'Mon,Thu,Sun', '2026-03-01', '2026-06-30'),
(8, '06:00:00', '07:35:00', 'Daily', '2026-03-01', '2026-06-30'),
(9, '20:00:00', '00:00:00', 'Daily', '2026-03-01', '2026-12-31'),
(10, '13:00:00', '16:00:00', 'Fri,Sat,Sun', '2026-03-01', '2026-06-30');

-- Insert Flight Amenities
INSERT INTO flight_amenities (flight_id, amenity) VALUES
(1, 'WiFi'),
(2, 'Extra Legroom'),
(3, 'In-flight Entertainment'),
(4, 'Complimentary Snacks'),
(5, 'Premium Lounge Access'),
(6, 'WiFi'),
(7, 'Priority Boarding'),
(8, 'Extra Legroom'),
(9, 'In-flight Entertainment'),
(10, 'Complimentary Meals');

-- Insert Cabin Class Configurations
INSERT INTO cabin_class_config (flight_id, class_type, base_price, currency, total_seats, available_seats, cabin_baggage, checked_baggage) VALUES
(1, 'Economy', 5000.00, 'INR', 180, 150, '7kg', '20kg'),
(2, 'Economy', 3000.00, 'INR', 160, 140, '7kg', '15kg'),
(3, 'Business', 1200.00, 'USD', 40, 35, '10kg', '30kg'),
(4, 'Economy', 2000.00, 'USD', 150, 120, '7kg', '20kg'),
(5, 'Business', 1500.00, 'USD', 50, 45, '10kg', '35kg'),
(6, 'Economy', 2500.00, 'AUD', 180, 160, '7kg', '20kg'),
(7, 'Economy', 4000.00, 'EUR', 170, 150, '7kg', '20kg'),
(8, 'Economy', 3500.00, 'EUR', 140, 120, '7kg', '15kg'),
(9, 'Business', 1000.00, 'USD', 60, 55, '10kg', '30kg'),
(10, 'Economy', 4500.00, 'USD', 200, 180, '7kg', '25kg');

-- Insert Airlines
INSERT INTO airlines (name, airline_code, airline_type) VALUES
('SkyJet Airways', 'SJ101', 'Commercial'),
('BlueSky Airlines', 'BS202', 'Commercial'),
('Global Connect', 'GC303', 'International'),
('Air Horizon', 'AH404', 'Domestic'),
('StarFly', 'SF505', 'Commercial'),
('CloudNine Air', 'CN606', 'Charter'),
('TransWorld', 'TW707', 'International'),
('AeroLink', 'AL808', 'Domestic'),
('Sunrise Airlines', 'SR909', 'Commercial'),
('NovaJet', 'NJ010', 'Charter');

-- Insert Routes
INSERT INTO routes (origin_code, destination_code, distance, duration_minutes) VALUES
('DEL', 'BOM', 1150, 120),
('BLR', 'HYD', 500, 70),
('NYC', 'LON', 5567, 420),
('SFO', 'SEA', 1093, 130),
('DXB', 'SIN', 5840, 430),
('SYD', 'MEL', 713, 90),
('PAR', 'ROM', 1105, 150),
('BER', 'AMS', 650, 95),
('HKG', 'TYO', 2960, 240),
('JFK', 'MIA', 1757, 180);

-- Insert Flights
INSERT INTO flights (flight_number, airline_id, route_id, aircraft_id, stops, status) VALUES
('SJ101-DEL-BOM', 1, 1, 'A320', 0, 'Scheduled'),
('BS202-BLR-HYD', 2, 2, 'B737', 0, 'Scheduled'),
('GC303-NYC-LON', 3, 3, 'B787', 0, 'Scheduled'),
('AH404-SFO-SEA', 4, 4, 'A319', 0, 'Scheduled'),
('SF505-DXB-SIN', 5, 5, 'A350', 0, 'Scheduled'),
('CN606-SYD-MEL', 6, 6, 'B737', 0, 'Scheduled'),
('TW707-PAR-ROM', 7, 7, 'A320', 0, 'Scheduled'),
('AL808-BER-AMS', 8, 8, 'E190', 0, 'Scheduled'),
('SR909-HKG-TYO', 9, 9, 'B777', 0, 'Scheduled'),
('NJ010-JFK-MIA', 10, 10, 'A321', 0, 'Scheduled');

-- Insert Flight Schedules
INSERT INTO flight_schedules (flight_id, departure_time, arrival_time, days_of_operation, effective_from, effective_to) VALUES
(1, '08:00:00', '10:00:00', 'Mon,Wed,Fri', '2026-03-01', '2026-06-30'),
(2, '09:30:00', '10:40:00', 'Tue,Thu,Sat', '2026-03-01', '2026-06-30'),
(3, '18:00:00', '02:00:00', 'Daily', '2026-03-01', '2026-12-31'),
(4, '07:00:00', '09:10:00', 'Mon-Fri', '2026-03-01', '2026-06-30'),
(5, '22:00:00', '05:10:00', 'Daily', '2026-03-01', '2026-12-31'),
(6, '11:00:00', '12:30:00', 'Daily', '2026-03-01', '2026-06-30'),
(7, '14:00:00', '16:30:00', 'Mon,Thu,Sun', '2026-03-01', '2026-06-30'),
(8, '06:00:00', '07:35:00', 'Daily', '2026-03-01', '2026-06-30'),
(9, '20:00:00', '00:00:00', 'Daily', '2026-03-01', '2026-12-31'),
(10, '13:00:00', '16:00:00', 'Fri,Sat,Sun', '2026-03-01', '2026-06-30');

-- Insert Flight Amenities
INSERT INTO flight_amenities (flight_id, amenity) VALUES
(1, 'WiFi'),
(2, 'Extra Legroom'),
(3, 'In-flight Entertainment'),
(4, 'Complimentary Snacks'),
(5, 'Premium Lounge Access'),
(6, 'WiFi'),
(7, 'Priority Boarding'),
(8, 'Extra Legroom'),
(9, 'In-flight Entertainment'),
(10, 'Complimentary Meals');

-- Insert Cabin Class Configurations
INSERT INTO cabin_class_config (flight_id, class_type, base_price, currency, total_seats, available_seats, cabin_baggage, checked_baggage) VALUES
(1, 'Economy', 5000.00, 'INR', 180, 150, '7kg', '20kg'),
(2, 'Economy', 3000.00, 'INR', 160, 140, '7kg', '15kg'),
(3, 'Business', 1200.00, 'USD', 40, 35, '10kg', '30kg'),
(4, 'Economy', 2000.00, 'USD', 150, 120, '7kg', '20kg'),
(5, 'Business', 1500.00, 'USD', 50, 45, '10kg', '35kg'),
(6, 'Economy', 2500.00, 'AUD', 180, 160, '7kg', '20kg'),
(7, 'Economy', 4000.00, 'EUR', 170, 150, '7kg', '20kg'),
(8, 'Economy', 3500.00, 'EUR', 140, 120, '7kg', '15kg'),
(9, 'Business', 1000.00, 'USD', 60, 55, '10kg', '30kg'),
(10, 'Economy', 4500.00, 'USD', 200, 180, '7kg', '25kg');



-- Unique Airlines
INSERT INTO airlines (name, airline_code, airline_type) VALUES
('Polar Air', 'PA01', 'International'),
('Aurora Airlines', 'AU02', 'Domestic'),
('Zenith Air', 'ZA03', 'Charter'),
('Nimbus Airways', 'NB04', 'International'),
('Falcon Jet', 'FJ05', 'Domestic'),
('Orion Air', 'OR06', 'International'),
('Pegasus Airlines', 'PG07', 'Charter'),
('Atlas Sky', 'AS08', 'International'),
('Vertex Airlines', 'VX09', 'Domestic'),
('Horizon Connect', 'HC10', 'International');

-- Unique Routes
INSERT INTO routes (origin_code, destination_code, distance, duration_minutes) VALUES
('MEX','YYZ',3250,240),
('GRU','EZE',1670,150),
('ICN','BKK',3700,310),
('JNB','CPT',1400,120),
('MAD','BCN',500,70),
('OSL','ARN',520,65),
('LAX','HNL',4100,330),
('YVR','SFO',1300,150),
('IST','ATH',1100,100),
('MNL','KUL',2500,210);

-- Unique Flights
INSERT INTO flights (flight_number, airline_id, route_id, aircraft_id, stops, status) VALUES
('PA301',1,1,'AC019',0,'SCHEDULED'),
('AU402',2,2,'AC020',0,'SCHEDULED'),
('ZA503',3,3,'AC021',0,'SCHEDULED'),
('NB604',4,4,'AC022',0,'SCHEDULED'),
('FJ705',5,5,'AC023',0,'SCHEDULED'),
('OR806',6,6,'AC024',0,'SCHEDULED'),
('PG907',7,7,'AC025',0,'SCHEDULED'),
('AS108',8,8,'AC026',0,'SCHEDULED'),
('VX209',9,9,'AC027',0,'SCHEDULED'),
('HC310',10,10,'AC028',0,'SCHEDULED');

-- Flight Schedules
INSERT INTO flight_schedules (flight_id, departure_time, arrival_time, days_of_operation, effective_from, effective_to) VALUES
(1,'09:00:00','13:00:00','Daily','2026-04-01','2026-12-31'),
(2,'15:00:00','17:30:00','Mon,Wed,Fri','2026-04-01','2026-12-31'),
(3,'22:00:00','03:10:00','Daily','2026-04-01','2026-12-31'),
(4,'07:30:00','09:30:00','Tue,Thu,Sat','2026-04-01','2026-12-31'),
(5,'11:00:00','12:10:00','Daily','2026-04-01','2026-12-31'),
(6,'06:00:00','07:05:00','Daily','2026-04-01','2026-12-31'),
(7,'12:00:00','17:30:00','Daily','2026-04-01','2026-12-31'),
(8,'08:30:00','11:00:00','Mon-Fri','2026-04-01','2026-12-31'),
(9,'14:00:00','15:40:00','Daily','2026-04-01','2026-12-31'),
(10,'19:00:00','22:30:00','Daily','2026-04-01','2026-12-31');

-- Flight Instances
INSERT INTO flight_instances (flight_id, schedule_id, departure_datetime, arrival_datetime, status, gate, terminal) VALUES
(1,1,'2026-04-15 09:00:00','2026-04-15 13:00:00','On Time','C1','T2'),
(2,2,'2026-04-16 15:00:00','2026-04-16 17:30:00','On Time','D2','T1'),
(3,3,'2026-04-17 22:00:00','2026-04-18 03:10:00','Delayed','E3','T4'),
(4,4,'2026-04-18 07:30:00','2026-04-18 09:30:00','On Time','F4','T3'),
(5,5,'2026-04-19 11:00:00','2026-04-19 12:10:00','On Time','G5','T2'),
(6,6,'2026-04-20 06:00:00','2026-04-20 07:05:00','Cancelled','H6','T1'),
(7,7,'2026-04-21 12:00:00','2026-04-21 17:30:00','On Time','I7','T3'),
(8,8,'2026-04-22 08:30:00','2026-04-22 11:00:00','On Time','J8','T2'),
(9,9,'2026-04-23 14:00:00','2026-04-23 15:40:00','On Time','K9','T1'),
(10,10,'2026-04-24 19:00:00','2026-04-24 22:30:00','On Time','L10','T4');

-- Flight Amenities
INSERT INTO flight_amenities (flight_id, amenity) VALUES
(1,'Wi-Fi'),
(2,'Meal Service'),
(3,'USB Charging'),
(4,'In-flight Entertainment'),
(5,'Extra Legroom'),
(6,'Complimentary Snacks'),
(7,'Premium Lounge Access'),
(8,'Priority Boarding'),
(9,'Complimentary Meals'),
(10,'Wi-Fi');

-- Cabin Class Configurations
INSERT INTO cabin_class_config (flight_id, class_type, base_price, currency, total_seats, available_seats, cabin_baggage, checked_baggage) VALUES
(1,'Economy',450.00,'USD',200,180,'7kg','23kg'),
(2,'Business',1200.00,'USD',40,35,'10kg','32kg'),
(3,'Economy',600.00,'THB',220,200,'7kg','20kg'),
(4,'Economy',300.00,'ZAR',180,160,'7kg','20kg'),
(5,'Economy',150.00,'EUR',150,140,'7kg','15kg'),
(6,'Economy',200.00,'SEK',140,130,'7kg','15kg'),
(7,'Business',900.00,'USD',50,45,'10kg','30kg'),
(8,'Economy',350.00,'CAD',160,150,'7kg','20kg'),
(9,'Economy',250.00,'TRY',170,160,'7kg','20kg'),
(10,'Economy',400.00,'MYR',180,170,'7kg','20kg');

SELECT * FROM flights;

UPDATE flights
SET aircraft_id = CASE id
    WHEN 1 THEN 'AC001'
    WHEN 2 THEN 'AC002'
    WHEN 3 THEN 'AC003'
    WHEN 4 THEN 'AC004'
    WHEN 5 THEN 'AC005'
    WHEN 6 THEN 'AC006'
    WHEN 7 THEN 'AC007'
    WHEN 8 THEN 'AC008'
    WHEN 9 THEN 'AC009'
    WHEN 10 THEN 'AC010'
    WHEN 11 THEN 'AC011'
    WHEN 12 THEN 'AC012'
    WHEN 13 THEN 'AC013'
    WHEN 14 THEN 'AC014'
    WHEN 15 THEN 'AC015'
    WHEN 16 THEN 'AC016'
    WHEN 17 THEN 'AC017'
    WHEN 18 THEN 'AC018'
    WHEN 19 THEN 'AC003'
    WHEN 20 THEN 'AC006'
    WHEN 21 THEN 'AC009'
    WHEN 22 THEN 'AC011'
END
WHERE id BETWEEN 1 AND 22;

use flight_db;
select * FROM flights;

