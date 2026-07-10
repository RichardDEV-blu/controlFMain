package com.controlf.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CrearPromesaRequestDTO {
    private Integer politicoId;
    private String descripcion;
    private String categoria;
    private LocalDate fechaPromesa;
}
