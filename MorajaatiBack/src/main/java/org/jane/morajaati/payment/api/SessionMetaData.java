package org.jane.morajaati.payment.api;

import java.util.UUID;

public record SessionMetaData(
        UUID userId,
        UUID courseId
) {
}
