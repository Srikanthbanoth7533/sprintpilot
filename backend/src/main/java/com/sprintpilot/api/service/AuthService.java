package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.JwtResponse;
import com.sprintpilot.api.dto.LoginRequest;
import com.sprintpilot.api.dto.RegisterRequest;
import com.sprintpilot.api.dto.UserDto;
import com.sprintpilot.api.entity.Role;
import com.sprintpilot.api.entity.User;
import com.sprintpilot.api.exception.BadRequestException;
import com.sprintpilot.api.exception.ResourceNotFoundException;
import com.sprintpilot.api.repository.UserRepository;
import com.sprintpilot.api.security.JwtUtils;
import com.sprintpilot.api.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getName(), userDetails.getEmail(), role);
    }

    @Transactional
    public UserDto registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already registered!");
        }

        Role role = signUpRequest.getRole() != null ? signUpRequest.getRole() : Role.ROLE_DEVELOPER;

        User user = new User(
                signUpRequest.getName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                role,
                signUpRequest.getTitle(),
                signUpRequest.getDepartment()
        );

        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadRequestException("No authenticated user found in session");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found with email: " + auth.getName()));
    }
}
