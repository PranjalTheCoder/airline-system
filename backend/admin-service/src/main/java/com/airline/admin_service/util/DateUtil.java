package com.airline.admin_service.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateUtil {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static String format(LocalDate date) {
        return date.format(formatter);
    }

    public static LocalDate parse(String date) {
        return LocalDate.parse(date, formatter);
    }
}