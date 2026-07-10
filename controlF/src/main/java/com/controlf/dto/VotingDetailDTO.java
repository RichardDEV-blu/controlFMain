package com.controlf.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class VotingDetailDTO {
    private Long id;
    private String firstName;
    private String lastname;
    private String description;
    private String territorial;
}
