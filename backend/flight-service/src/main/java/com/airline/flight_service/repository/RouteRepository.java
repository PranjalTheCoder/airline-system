package com.airline.flight_service.repository;



import com.airline.flight_service.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RouteRepository extends JpaRepository<Route, Long> {

    @Query("""
        SELECT r FROM Route r
        WHERE r.origin.iataCode = :origin
        AND r.destination.iataCode = :destination
    """)
    Route findRoute(String origin, String destination);
}