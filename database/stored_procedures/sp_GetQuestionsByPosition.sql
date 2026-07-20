DELIMITER $$

CREATE PROCEDURE sp_GetQuestionsByPosition(
    IN p_PositionId INT
)
BEGIN
    SELECT
        Id AS QuestionId,
        QuestionText,
        QuestionType
    FROM InterviewQuestions
    WHERE PositionId = p_PositionId
    ORDER BY Id ASC;
END$$

DELIMITER ;
