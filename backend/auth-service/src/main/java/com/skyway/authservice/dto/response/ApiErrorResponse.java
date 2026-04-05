package com.skyway.authservice.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record ApiErrorResponse(
        String message,
        Map<String, List<String>> details,
        Instant timestamp,
        String path
) {
}
