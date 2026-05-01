package com.taskflow.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.Set;

@Getter @Builder
public class AuthResponse {
    private String accessToken;
    private String tokenType;
    private Long expiresIn;
    private UserInfo user;

    @Getter @Builder
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private Set<String> roles;
    }
}
