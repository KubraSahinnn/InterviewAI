-- NOT: Bu prosedür hem statik (InterviewQuestions tablosundan) hem de dinamik
-- (yapay zeka tarafından anlık üretilip InterviewAnswers.QuestionText'e yazılan)
-- soru-cevapları destekler. Rapor oluşturma bu prosedürü kullanır.

DELIMITER $$

CREATE PROCEDURE sp_GetSessionAnswers(
    IN p_SessionId INT
)
BEGIN
    SELECT
        COALESCE(q.QuestionText, a.QuestionText) AS Question,
        a.AnswerText AS Answer
    FROM InterviewAnswers a
    LEFT JOIN InterviewQuestions q ON q.Id = a.QuestionId
    WHERE a.SessionId = p_SessionId
    ORDER BY a.Id ASC;
END$$

DELIMITER ;
