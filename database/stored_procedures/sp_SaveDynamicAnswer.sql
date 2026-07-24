DELIMITER $$

CREATE PROCEDURE sp_SaveDynamicAnswer(
    IN p_SessionId INT,
    IN p_QuestionNumber INT,
    IN p_QuestionText TEXT,
    IN p_AnswerText TEXT,
    IN p_DurationSeconds INT
)
BEGIN
    INSERT INTO InterviewAnswers (SessionId, QuestionId, QuestionNumber, QuestionText, AnswerText, AnswerDurationSeconds)
    VALUES (p_SessionId, NULL, p_QuestionNumber, p_QuestionText, p_AnswerText, p_DurationSeconds);
END$$

DELIMITER ;
