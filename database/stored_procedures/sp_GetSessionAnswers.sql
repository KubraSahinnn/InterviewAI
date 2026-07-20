DELIMITER $$

CREATE PROCEDURE sp_GetSessionAnswers(
    IN p_SessionId INT
)
BEGIN
    SELECT
        q.QuestionText AS Question,
        a.AnswerText AS Answer
    FROM InterviewAnswers a
    INNER JOIN InterviewQuestions q ON q.Id = a.QuestionId
    WHERE a.SessionId = p_SessionId
    ORDER BY a.Id ASC;
END$$

DELIMITER ;
