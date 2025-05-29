package org.jane.morajaati.video.domain.model;

import java.util.UUID;

public record UserVideo(
        UUID id,
        UUID userId,
        UUID resourceId
) {
}