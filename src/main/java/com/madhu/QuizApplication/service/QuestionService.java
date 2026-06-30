package com.madhu.QuizApplication.service;

import com.madhu.QuizApplication.models.Question;
import com.madhu.QuizApplication.repository.QuestionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    public QuestionDao questionDao;

    public Question addQuestion(Question question) {
        return questionDao.save(question);
    }

    public List<Question> addAllQuestions(List<Question> questions) {
        return questionDao.saveAll(questions);
    }


    public List<Question> getAllQuestions(){
        return questionDao.findAll();
    }

    public List<Question> getQuestionsByCategory(String category) {
        return questionDao.findByCategory(category);
    }

    public Question updateQuestion(Question question) {
        return questionDao.save(question);
    }

    public void deleteQuestion(Integer id) {
        questionDao.deleteById(id);
    }

}
