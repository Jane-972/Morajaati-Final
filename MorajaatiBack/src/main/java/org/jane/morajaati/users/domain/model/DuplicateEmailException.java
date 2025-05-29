package org.jane.morajaati.users.domain.model;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String email) {
        super("A user with email: `" + email + "` already exists");
    }
}




