package br.com.hazze.cury.marketplace.handler;

import java.time.LocalDateTime;
import java.util.Map;

public record ValidationErrorResponse(
        LocalDateTime timestamp,
        Integer status,
        String error,
        Map<String, String> fields,
        String path
) {
}
