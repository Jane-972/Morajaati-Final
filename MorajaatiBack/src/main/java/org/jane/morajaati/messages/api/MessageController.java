package org.jane.morajaati.messages.api;

import org.jane.morajaati.messages.api.dto.MessageRequestDTO;
import org.jane.morajaati.messages.repo.MessageEntity;
import org.jane.morajaati.messages.repo.MessageRepo;
import org.jane.morajaati.users.repo.UserEntity;
import org.jane.morajaati.users.repo.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
  private final MessageRepo messageRepo;

  private final UserRepo userRepo;

  public MessageController(MessageRepo messageRepo, UserRepo userRepo) {
    this.messageRepo = messageRepo;
    this.userRepo = userRepo;
  }

  @PostMapping
  public ResponseEntity<String> sendMessage(@RequestBody MessageRequestDTO dto) {
    UserEntity sender = userRepo.findById(dto.senderId())
      .orElseThrow(() -> new RuntimeException("Sender not found"));
    UserEntity receiver = userRepo.findById(dto.receiverId())
      .orElseThrow(() -> new RuntimeException("Receiver not found"));

    MessageEntity message = new MessageEntity(sender, receiver, dto.content());
    messageRepo.save(message);

    return ResponseEntity.ok("Message sent successfully");
  }
}
