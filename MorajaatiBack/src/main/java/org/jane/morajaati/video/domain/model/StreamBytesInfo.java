package org.jane.morajaati.video.domain.model;

import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;


public record StreamBytesInfo(
        StreamingResponseBody responseBody,
        long fileSize,
        long rangeStart,
        long rangeEnd,
        String contentType
) {
}