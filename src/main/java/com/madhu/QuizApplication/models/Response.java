package com.madhu.QuizApplication.models;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class Response {

    private Integer id;

    private String response;
}
