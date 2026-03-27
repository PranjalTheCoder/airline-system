package com.airline.inventory_service.util;

public class PricingUtil {

    public static double calculatePrice(String seatType, boolean isExitRow, int rowNum) {

        double price = 0;

        // Base pricing
        if (Constants.WINDOW.equals(seatType)) {
            price = Constants.WINDOW_PRICE;
        } else if (Constants.AISLE.equals(seatType)) {
            price = Constants.AISLE_PRICE;
        }

        // Exit row
        if (isExitRow) {
            price = Constants.EXTRA_LEGROOM_PRICE;
        }

        // Premium rows
        if (rowNum <= 11) {
            price = Constants.PREMIUM_PRICE;
        }

        return price;
    }
}