package org.jane.morajaati.messages.service;

import org.jane.morajaati.messages.repo.MessageEntity;
import org.jane.morajaati.messages.repo.MessageRepo;
import org.jane.morajaati.users.repo.UserEntity;
import org.jane.morajaati.users.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MessageService {
  private final MessageRepo messageRepo;
  private final UserRepo userRepo;

  public MessageService(MessageRepo messageRepo, UserRepo userRepo) {
    this.messageRepo = messageRepo;
    this.userRepo = userRepo;
  }

  public void sendMessage(UUID senderId, UUID receiverId, String content) {
    UserEntity sender = userRepo.findById(senderId)
      .orElseThrow(() -> new RuntimeException("Sender not found"));

    UserEntity receiver = userRepo.findById(receiverId)
      .orElseThrow(() -> new RuntimeException("Receiver not found"));

    MessageEntity message = new MessageEntity(sender, receiver, content);
    messageRepo.save(message);
  }
}
