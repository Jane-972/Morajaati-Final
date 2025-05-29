package org.jane.morajaati.users.api;


import jakarta.validation.Valid;
import org.jane.morajaati.users.api.dto.UserInputDTO;
import org.jane.morajaati.users.api.dto.UserOutputDTO;
import org.jane.morajaati.users.api.dto.UserPatchDTO;
import org.jane.morajaati.users.domain.model.CreateUserModel;
import org.jane.morajaati.users.domain.model.UserModel;
import org.jane.morajaati.users.domain.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;
import java.util.stream.Stream;


@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public UserOutputDTO addUser(@RequestBody @Valid UserInputDTO input) {
        CreateUserModel model = input.toModel();
        UserModel savedUser = userService.createUser(model);
        return UserOutputDTO.fromModel(savedUser);
    }

    @GetMapping()
    public Stream<UserOutputDTO> getAllUsers() {
        return userService.getAllUsers()
                .stream()
                .map(UserOutputDTO::fromModel);
    }


    @PatchMapping("{id}")
    public UserOutputDTO updateUserProfile(
            @PathVariable UUID id,
            @RequestBody UserPatchDTO updateRequest
    ) {
        UserModel updatedUser = userService.updateUserProfile(id, updateRequest.toModel());
        return UserOutputDTO.fromModel(updatedUser);
    }

    @GetMapping("/me")
    public UserOutputDTO getProfile(Principal principal) {
        UserModel user = userService.getCurrentUser(principal);
        return UserOutputDTO.fromModel(user);
    }
}
