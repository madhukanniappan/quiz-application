package com.madhu.QuizApplication.service;

import com.madhu.QuizApplication.models.Question;
import com.madhu.QuizApplication.models.QuestionWrapper;
import com.madhu.QuizApplication.models.Quiz;
import com.madhu.QuizApplication.models.Response;
import com.madhu.QuizApplication.repository.QuestionDao;
import com.madhu.QuizApplication.repository.QuizDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    public QuestionDao questionDao;

    @Autowired
    public QuizDao quizDao;

    public Quiz createQuiz(String category, int numQ, String title) {
        List<Question> questions = questionDao.findRandomQuestionsByCategory(category, numQ);
        System.out.println("Questions found = " + questions.size());

        Quiz quiz = new Quiz();
        quiz.setQuestions(questions);
        quiz.setTitle(title);

        return quizDao.save(quiz);
    }

    public List<QuestionWrapper> getQuizQuestions(Integer id) {

        Optional<Quiz> quiz = quizDao.findById(id);

        List<Question> questionsFromDB = quiz.get().getQuestions();

        List<QuestionWrapper> questionsForUser = new ArrayList<>();

        for(Question q: questionsFromDB){

            QuestionWrapper qw = new QuestionWrapper(q.getId(), q.getQuestionTitle(), q.getOption1(), q.getOption2(), q.getOption3(), q.getOption4());

            questionsForUser.add(qw);
        }

        return questionsForUser;

    }

    public Integer calculateResult(Integer id, List<Response> responses) {

        Quiz quiz = quizDao.findById(id).get();
        List<Question> questions = quiz.getQuestions();

        int right=0;
        for (int i = 0; i < responses.size(); i++) {
            Response response = responses.get(i);
            Question question = questions.get(i);

            if(question.getRightAnswer().equals(response.getResponse())){
                right++;
            }

        }
        return right;
    }
}
