package org.jane.morajaati.common.service;

import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * A service that generates UUIDs.
 */
@Service
public class UuidGenerator {
    /**
     * @return a new UUID
     */
    public UUID generateId() {
        return UUID.randomUUID();
    }
}
