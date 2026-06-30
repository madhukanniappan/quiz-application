package com.madhu.QuizApplication.repository;

import com.madhu.QuizApplication.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionDao extends JpaRepository<Question, Integer> {
    List<Question> findByCategory(String category);

    @Query(value = "SELECT * FROM question q WHERE q.category=:category ORDER BY RANDOM() LIMIT :numQ ", nativeQuery = true)
    List<Question> findRandomQuestionsByCategory(String category, int numQ);
}
