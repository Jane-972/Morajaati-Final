package org.jane.morajaati.users.repo;

import jakarta.annotation.Nullable;
import org.jane.morajaati.users.domain.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface UserRepo extends JpaRepository<UserEntity, UUID> {
    boolean existsByEmail(String email);

    @Nullable
    UserEntity findByEmail(String email);

    List<UserEntity> findAllByRole(UserRole role);

    List<UserEntity> findAllByRoleAndIdIn(UserRole role, Collection<UUID> ids);
}


