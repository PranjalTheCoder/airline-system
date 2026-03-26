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