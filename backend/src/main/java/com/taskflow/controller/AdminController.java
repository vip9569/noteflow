package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.dto.PageResponse;
import com.taskflow.dto.TaskResponse;
import com.taskflow.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final TaskService taskService;

    @GetMapping("/tasks")
    @Operation(summary = "Get all tasks across all users (Admin only)")
    public ResponseEntity<ApiResponse<PageResponse<TaskResponse>>> getAllTasks(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<TaskResponse> tasks = taskService.getAllTasks(page, size);
        return ResponseEntity.ok(ApiResponse.ok("All tasks retrieved", tasks));
    }
}
