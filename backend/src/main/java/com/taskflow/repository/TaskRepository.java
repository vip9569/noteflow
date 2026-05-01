package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.entity.Task.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByUserId(Long userId, Pageable pageable);

    Page<Task> findByUserIdAndStatus(Long userId, Status status, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Task> findByUserIdWithFilters(
        @Param("userId") Long userId,
        @Param("status") Status status,
        @Param("search") String search,
        Pageable pageable
    );

    long countByUserIdAndStatus(Long userId, Status status);
}
