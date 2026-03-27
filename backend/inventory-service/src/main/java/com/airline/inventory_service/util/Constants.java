package com.airline.inventory_service.util;

public class Constants {

    // Seat Types
    public static final String WINDOW = "WINDOW";
    public static final String AISLE = "AISLE";
    public static final String STANDARD = "STANDARD";
    public static final String PREMIUM = "PREMIUM";

    // Seat Status
    public static final String AVAILABLE = "AVAILABLE";
    public static final String OCCUPIED = "OCCUPIED";
    public static final String BLOCKED = "BLOCKED";
    public static final String HELD = "HELD";

    // Pricing
    public static final double WINDOW_PRICE = 25;
    public static final double AISLE_PRICE = 20;
    public static final double EXTRA_LEGROOM_PRICE = 45;
    public static final double PREMIUM_PRICE = 60;

    // Features
    public static final String FEATURE_WINDOW = "WINDOW";
    public static final String FEATURE_AISLE = "AISLE";
    public static final String FEATURE_EXIT_ROW = "EXIT_ROW";
    public static final String FEATURE_EXTRA_LEGROOM = "EXTRA_LEGROOM";
    public static final String FEATURE_RECLINE = "RECLINE";

    // Lock
    public static final int LOCK_DURATION_MINUTES = 10;

    private Constants() {
        // prevent instantiation
    }
}