package com.controlf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeySyncStatusDTO {
    private int total;
    private int completed;
    private int imported;
    private int duplicated;
    private int ignored;
    private String currentLeyTitulo;
}
