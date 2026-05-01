package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.dto.PageResponse;
import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.TaskUpdateRequest;
import com.taskflow.entity.Task;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task CRUD operations")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        TaskResponse task = taskService.createTask(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Task created", task));
    }

    @GetMapping
    @Operation(summary = "Get my tasks (paginated, filterable)")
    public ResponseEntity<ApiResponse<PageResponse<TaskResponse>>> getMyTasks(
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "10")  int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) Task.Status status,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal UserPrincipal principal) {

        PageResponse<TaskResponse> tasks = taskService.getMyTasks(
            principal, page, size, sortBy, direction, status, search);
        return ResponseEntity.ok(ApiResponse.ok("Tasks retrieved", tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single task by ID")
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        TaskResponse task = taskService.getTaskById(id, principal);
        return ResponseEntity.ok(ApiResponse.ok("Task retrieved", task));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a task (partial update)")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        TaskResponse task = taskService.updateTask(id, request, principal);
        return ResponseEntity.ok(ApiResponse.ok("Task updated", task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        taskService.deleteTask(id, principal);
        return ResponseEntity.ok(ApiResponse.ok("Task deleted"));
    }
}
