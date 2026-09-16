package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.UserDto;
import com.sprintpilot.api.entity.Role;
import com.sprintpilot.api.entity.Team;
import com.sprintpilot.api.entity.User;
import com.sprintpilot.api.repository.TeamRepository;
import com.sprintpilot.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Team team : teams) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", team.getId());
            map.put("name", team.getName());
            map.put("department", team.getDepartment());
            map.put("lead", UserDto.fromEntity(team.getLead()));
            map.put("members", team.getMembers().stream().map(UserDto::fromEntity).collect(Collectors.toList()));
            map.put("memberCount", team.getMembers().size());
            result.add(map);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
}
