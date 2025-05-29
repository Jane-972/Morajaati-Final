package org.jane.morajaati.messages.api.dto;

import java.util.UUID;

public record MessageRequestDTO(
  UUID senderId,
  UUID receiverId,
  String content
) {}