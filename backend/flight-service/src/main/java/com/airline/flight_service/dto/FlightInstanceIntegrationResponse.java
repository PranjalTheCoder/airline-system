
    package com.airline.flight_service.dto;

    import java.time.LocalDate;

    public class FlightInstanceIntegrationResponse {

        private Long id;
        private String flightNumber;
        private LocalDate departureDate;
        private String status;

        // ✅ No-argument constructor
        public FlightInstanceIntegrationResponse() {}

        // ✅ Parameterized constructor
        public FlightInstanceIntegrationResponse(Long id, String flightNumber,
                                                 LocalDate departureDate, String status) {
            this.id = id;
            this.flightNumber = flightNumber;
            this.departureDate = departureDate;
            this.status = status;
        }

        // ✅ Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFlightNumber() {
            return flightNumber;
        }

        public void setFlightNumber(String flightNumber) {
            this.flightNumber = flightNumber;
        }

        public LocalDate getDepartureDate() {
            return departureDate;
        }

        public void setDepartureDate(LocalDate departureDate) {
            this.departureDate = departureDate;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
}