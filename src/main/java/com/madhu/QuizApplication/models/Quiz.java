package com.madhu.QuizApplication.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Quiz title cannot be empty")
    private String title;

    @ManyToMany
    private List<Question> questions;
}
