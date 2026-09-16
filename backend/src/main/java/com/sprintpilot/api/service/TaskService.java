package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.TaskRequest;
import com.sprintpilot.api.dto.TaskResponse;
import com.sprintpilot.api.entity.Task;
import com.sprintpilot.api.entity.TaskStatus;
import com.sprintpilot.api.entity.UserStory;
import com.sprintpilot.api.exception.ResourceNotFoundException;
import com.sprintpilot.api.repository.TaskRepository;
import com.sprintpilot.api.repository.UserRepository;
import com.sprintpilot.api.repository.UserStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByStory(Long storyId) {
        return taskRepository.findByUserStoryId(storyId).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse createTask(TaskRequest req) {
        UserStory story = userStoryRepository.findById(req.getStoryId())
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + req.getStoryId()));

        Task task = new Task();
        task.setUserStory(story);
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setStatus(req.getStatus() != null ? req.getStatus() : TaskStatus.TODO);
        task.setEstimatedHours(req.getEstimatedHours() != null ? req.getEstimatedHours() : 2.0);
        task.setLoggedHours(req.getLoggedHours() != null ? req.getLoggedHours() : 0.0);

        if (req.getAssigneeId() != null) {
            userRepository.findById(req.getAssigneeId()).ifPresent(task::setAssignee);
        }

        task = taskRepository.save(task);
        return TaskResponse.fromEntity(task);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setStatus(status);
        task = taskRepository.save(task);
        return TaskResponse.fromEntity(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }
}
