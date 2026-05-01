package com.taskflow.dto;

import com.taskflow.entity.Task;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class TaskUpdateRequest {
    @Size(max = 200)
    private String title;
    private String description;
    private Task.Status status;
    private Task.Priority priority;
    private LocalDate dueDate;
}
