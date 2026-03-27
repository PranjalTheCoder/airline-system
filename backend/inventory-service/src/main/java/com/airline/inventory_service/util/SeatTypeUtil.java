package com.airline.inventory_service.util;

public class SeatTypeUtil {

    public static String getSeatType(String column) {

        if ("A".equals(column) || "F".equals(column)) {
            return Constants.WINDOW;
        } else if ("C".equals(column) || "D".equals(column)) {
            return Constants.AISLE;
        } else {
            return Constants.STANDARD;
        }
    }
}