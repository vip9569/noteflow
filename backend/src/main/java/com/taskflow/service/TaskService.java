package com.taskflow.service;

import com.taskflow.dto.PageResponse;
import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.TaskUpdateRequest;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional
    public TaskResponse createTask(TaskRequest request, UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User", principal.getId()));

        Task task = Task.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .status(request.getStatus() != null ? request.getStatus() : Task.Status.TODO)
            .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM)
            .dueDate(request.getDueDate())
            .user(user)
            .build();

        task = taskRepository.save(task);
        log.debug("Task created: id={} by user={}", task.getId(), principal.getUsername());
        return toResponse(task);
    }

    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> getMyTasks(
            UserPrincipal principal, int page, int size,
            String sortBy, String direction, Task.Status status, String search) {

        Sort sort = direction.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Task> taskPage = taskRepository.findByUserIdWithFilters(
            principal.getId(), status, search, pageable
        );

        return PageResponse.from(taskPage, this::toResponse);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId, UserPrincipal principal) {
        Task task = findTaskAndCheckOwnership(taskId, principal);
        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, TaskUpdateRequest request, UserPrincipal principal) {
        Task task = findTaskAndCheckOwnership(taskId, principal);

        if (request.getTitle() != null)       task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null)      task.setStatus(request.getStatus());
        if (request.getPriority() != null)    task.setPriority(request.getPriority());
        if (request.getDueDate() != null)     task.setDueDate(request.getDueDate());

        task = taskRepository.save(task);
        log.debug("Task updated: id={} by user={}", task.getId(), principal.getUsername());
        return toResponse(task);
    }

    @Transactional
    public void deleteTask(Long taskId, UserPrincipal principal) {
        Task task = findTaskAndCheckOwnership(taskId, principal);
        taskRepository.delete(task);
        log.debug("Task deleted: id={} by user={}", taskId, principal.getUsername());
    }

    // Admin: view all tasks
    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> getAllTasks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return PageResponse.from(taskRepository.findAll(pageable), this::toResponse);
    }

    private Task findTaskAndCheckOwnership(Long taskId, UserPrincipal principal) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));

        boolean isAdmin = principal.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !task.getUser().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You do not own this task");
        }
        return task;
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus())
            .priority(task.getPriority())
            .dueDate(task.getDueDate())
            .userId(task.getUser().getId())
            .username(task.getUser().getUsername())
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .build();
    }
}
