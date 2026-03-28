CREATE DATABASE airline_admin;
use airline_admin;

-- ✈️ Tablesd
-- Aircraft
CREATE TABLE aircraft (
  id VARCHAR(20) PRIMARY KEY,
  registration VARCHAR(50),
  model VARCHAR(50),
  manufacturer VARCHAR(50),
  capacity INT,
  cabin_config JSON,
  status VARCHAR(20),
  year_built INT,
  last_maintenance DATE,
  next_maintenance DATE
);

-- Airport
CREATE TABLE airports (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100),
  city VARCHAR(50),
  country VARCHAR(50),
  status VARCHAR(20)
);

CREATE TABLE airport_terminals (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  airport_code VARCHAR(10),
  terminal VARCHAR(10)
);

-- Crew
CREATE TABLE crew (
  id VARCHAR(20) PRIMARY KEY,
  employee_id VARCHAR(20),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role VARCHAR(20),
  license VARCHAR(50),
  base VARCHAR(20),
  status VARCHAR(20),
  flight_hours_month INT,
  flight_hours_max INT
);

CREATE TABLE crew_ratings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  crew_id VARCHAR(20),
  aircraft_type VARCHAR(50)
);

ALTER TABLE airports ADD COLUMN timezone VARCHAR(50);


-- Insert Airports
INSERT INTO airports (code, name, city, country, status) VALUES
('DEL', 'Indira Gandhi International Airport', 'New Delhi', 'India', 'Active'),
('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India', 'Active'),
('BLR', 'Kempegowda International Airport', 'Bengaluru', 'India', 'Active'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'India', 'Active'),
('NYC', 'John F. Kennedy International Airport', 'New York', 'USA', 'Active'),
('LON', 'Heathrow Airport', 'London', 'United Kingdom', 'Active'),
('SFO', 'San Francisco International Airport', 'San Francisco', 'USA', 'Active'),
('SEA', 'Seattle-Tacoma International Airport', 'Seattle', 'USA', 'Active'),
('DOH', 'Hamad International Airport', 'Doha', 'Qatar', 'Active'),
('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore', 'Active');

-- Alter table to add timezone column
ALTER TABLE airports ADD COLUMN timezone VARCHAR(50);

-- Update Airports with Timezones
UPDATE airports SET timezone = 'Asia/Kolkata' WHERE code IN ('DEL','BOM','BLR','HYD');
UPDATE airports SET timezone = 'America/New_York' WHERE code = 'NYC';
UPDATE airports SET timezone = 'Europe/London' WHERE code = 'LON';
UPDATE airports SET timezone = 'America/Los_Angeles' WHERE code = 'SFO';
UPDATE airports SET timezone = 'America/Los_Angeles' WHERE code = 'SEA';
UPDATE airports SET timezone = 'Asia/Dubai' WHERE code = 'DXB';
UPDATE airports SET timezone = 'Asia/Singapore' WHERE code = 'SIN';


SELECT * from aircraft;

-- Update airport timezones
UPDATE airports SET timezone = 'Asia/Kolkata' WHERE code IN ('DEL', 'BOM', 'BLR', 'HYD');
UPDATE airports SET timezone = 'Asia/Qatar' WHERE code = 'DOH';
UPDATE airports SET timezone = 'Asia/Dubai' WHERE code = 'DXB';
UPDATE airports SET timezone = 'Europe/Berlin' WHERE code = 'FRA';
UPDATE airports SET timezone = 'Asia/Tokyo' WHERE code = 'HND';
UPDATE airports SET timezone = 'America/New_York' WHERE code IN ('JFK', 'NYC');
UPDATE airports SET timezone = 'Europe/London' WHERE code IN ('LHR', 'LON');
UPDATE airports SET timezone = 'Asia/Shanghai' WHERE code = 'PEK';
UPDATE airports SET timezone = 'America/Los_Angeles' WHERE code IN ('SEA', 'SFO');
UPDATE airports SET timezone = 'Asia/Singapore' WHERE code = 'SIN';
UPDATE airports SET timezone = 'Australia/Sydney' WHERE code = 'SYD';

INSERT INTO aircraft (id, registration, model, manufacturer, capacity, cabin_config, status, year_built, last_maintenance, next_maintenance) VALUES
('AC009', 'N-SW009', 'Airbus A321neo', 'Airbus', 200, '{"first":null,"business":20,"premiumEconomy":null,"economy":180}', 'ACTIVE', 2021, '2025-12-05', '2026-06-05'),
('AC010', 'N-SW010', 'Boeing 737 MAX 9', 'Boeing', 193, '{"first":null,"business":24,"premiumEconomy":null,"economy":169}', 'ACTIVE', 2022, '2025-11-20', '2026-05-20'),
('AC011', 'N-SW011', 'Airbus A350-1000', 'Airbus', 369, '{"first":12,"business":60,"premiumEconomy":40,"economy":257}', 'ACTIVE', 2021, '2025-10-15', '2026-04-15'),
('AC012', 'N-SW012', 'Boeing 777-200LR', 'Boeing', 317, '{"first":8,"business":48,"premiumEconomy":null,"economy":261}', 'ACTIVE', 2018, '2025-09-25', '2026-03-25'),
('AC013', 'N-SW013', 'Embraer E175', 'Embraer', 88, '{"first":null,"business":12,"premiumEconomy":null,"economy":76}', 'ACTIVE', 2016, '2025-12-01', '2026-06-01'),
('AC014', 'N-SW014', 'Bombardier Q400', 'Bombardier', 78, '{"first":null,"business":8,"premiumEconomy":null,"economy":70}', 'ACTIVE', 2015, '2025-11-10', '2026-05-10'),
('AC015', 'N-SW015', 'Airbus A330-300', 'Airbus', 277, '{"first":6,"business":36,"premiumEconomy":24,"economy":211}', 'ACTIVE', 2017, '2025-12-18', '2026-06-18'),
('AC016', 'N-SW016', 'Boeing 757-300', 'Boeing', 243, '{"first":null,"business":24,"premiumEconomy":30,"economy":189}', 'ACTIVE', 2014, '2025-10-30', '2026-04-30'),
('AC017', 'N-SW017', 'Airbus A220-100', 'Airbus', 120, '{"first":null,"business":12,"premiumEconomy":null,"economy":108}', 'ACTIVE', 2020, '2025-12-22', '2026-06-22'),
('AC018', 'N-SW018', 'Comac C919', 'Comac', 174, '{"first":null,"business":20,"premiumEconomy":null,"economy":154}', 'ACTIVE', 2023, '2025-11-05', '2026-05-05');


SELECT * FROM Aircraft;
