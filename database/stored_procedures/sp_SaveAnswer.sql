DELIMITER $$

CREATE PROCEDURE sp_SaveAnswer(
    IN p_SessionId INT,
    IN p_QuestionId INT,
    IN p_AnswerText TEXT,
    IN p_DurationSeconds INT
)
BEGIN
    INSERT INTO InterviewAnswers (SessionId, QuestionId, AnswerText, AnswerDurationSeconds)
    VALUES (p_SessionId, p_QuestionId, p_AnswerText, p_DurationSeconds);
END$$

DELIMITER ;
