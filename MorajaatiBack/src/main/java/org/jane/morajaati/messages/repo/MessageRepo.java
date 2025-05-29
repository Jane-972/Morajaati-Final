package org.jane.morajaati.messages.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepo extends JpaRepository<MessageEntity, UUID> {
}
