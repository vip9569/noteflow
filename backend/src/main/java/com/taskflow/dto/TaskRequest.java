package com.taskflow.dto;

import com.taskflow.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class TaskRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be under 200 characters")
    private String title;

    private String description;
    private Task.Status status;
    private Task.Priority priority;
    private LocalDate dueDate;
}
