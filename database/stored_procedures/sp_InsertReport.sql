DELIMITER $$

CREATE PROCEDURE sp_InsertReport(
    IN p_SessionId INT,
    IN p_Strengths TEXT,
    IN p_AreasToImprove TEXT,
    IN p_OverallScore DECIMAL(5,2)
)
BEGIN
    INSERT INTO InterviewReports (SessionId, Strengths, AreasToImprove, OverallScore, CreatedAt)
    VALUES (p_SessionId, p_Strengths, p_AreasToImprove, p_OverallScore, NOW());

    UPDATE InterviewSessions
    SET Status = 'Completed', EndedAt = NOW()
    WHERE Id = p_SessionId;
END$$

DELIMITER ;
