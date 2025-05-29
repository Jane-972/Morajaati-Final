package org.jane.morajaati.messages.repo;

import jakarta.persistence.*;
import org.jane.morajaati.users.repo.UserEntity;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
public class MessageEntity {

  @Id
  @GeneratedValue
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "sender_id")
  private UserEntity sender;

  @ManyToOne
  @JoinColumn(name = "receiver_id")
  private UserEntity receiver;

  @Column(nullable = false)
  private String content;

  @Column(name = "sent_at", nullable = false)
  private LocalDateTime sentAt;

  public MessageEntity() {}

  public MessageEntity(UserEntity sender, UserEntity receiver, String content) {
    this.sender = sender;
    this.receiver = receiver;
    this.content = content;
    this.sentAt = LocalDateTime.now();
  }

  // Getters (optional setters if you need)
  public UUID getId() { return id; }
  public UserEntity getSender() { return sender; }
  public UserEntity getReceiver() { return receiver; }
  public String getContent() { return content; }
  public LocalDateTime getSentAt() { return sentAt; }
}
