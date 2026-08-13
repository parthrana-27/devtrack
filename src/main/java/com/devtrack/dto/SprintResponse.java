package com.devtrack.dto;

import com.devtrack.entity.SprintStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SprintResponse {
    private Long id;
    private String name;
    private Long projectId;
    private LocalDate startDate;
    private LocalDate endDate;
    private SprintStatus status;
}
