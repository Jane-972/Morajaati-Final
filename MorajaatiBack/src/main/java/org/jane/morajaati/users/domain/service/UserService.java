package org.jane.morajaati.users.domain.service;

import org.jane.morajaati.users.domain.model.CreateUserModel;
import org.jane.morajaati.users.domain.model.PatchUserModel;
import org.jane.morajaati.users.domain.model.UserModel;
import org.jane.morajaati.users.domain.model.UserRole;
import org.jane.morajaati.users.repo.UserStorageFacade;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.UUID;


@Service
public class UserService {
    private final UserStorageFacade userStorageFacade;

    public UserService(UserStorageFacade userStorageFacade) {
        this.userStorageFacade = userStorageFacade;
    }

    public UserModel createUser(CreateUserModel userModel) {
        boolean isFirstUser = userStorageFacade.isFirstUser();
        UserRole role = isFirstUser ? UserRole.ADMIN : UserRole.STUDENT;

        return userStorageFacade.storeUser(
                userModel,
                role,
                isFirstUser
        );
    }

    public List<UserModel> getAllUsers() {
        return userStorageFacade.fetchAllUsers();
    }

    public UserModel approveUser(UUID userId) {
        return userStorageFacade.updateUserApproval(userId, true);
    }

    public UserModel getCurrentUser(Principal principal) {
        return userStorageFacade.fetchUserById(UUID.fromString(principal.getName()));
    }

    public UserModel updateUserProfile(UUID userId, PatchUserModel updateRequest) {
        return userStorageFacade.updateUserProfile(userId, updateRequest);
    }
}
