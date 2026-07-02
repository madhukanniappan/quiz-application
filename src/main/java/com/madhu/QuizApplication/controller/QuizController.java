package com.madhu.QuizApplication.controller;

import com.madhu.QuizApplication.models.QuestionWrapper;
import com.madhu.QuizApplication.models.Quiz;
import com.madhu.QuizApplication.models.Response;
import com.madhu.QuizApplication.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    @Autowired
    public QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<Quiz> createQuiz(@RequestParam String category, @RequestParam int numQ, @RequestParam String title){
        return new ResponseEntity<>(quizService.createQuiz(category, numQ, title), HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id){
        return new ResponseEntity<>(quizService.getQuizQuestions(id), HttpStatus.OK);
    }

    @PostMapping("/submit/{id}")
    public ResponseEntity<Integer> submitQuiz(@PathVariable Integer id, @RequestBody List<Response> responses){
        return new ResponseEntity<>(quizService.calculateResult(id, responses), HttpStatus.OK);
    }


}
