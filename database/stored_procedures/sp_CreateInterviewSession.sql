DELIMITER $$

CREATE PROCEDURE sp_CreateInterviewSession(
    IN p_UserId INT,
    IN p_PositionId INT,
    OUT p_NewSessionId INT
)
BEGIN
    INSERT INTO InterviewSessions (UserId, PositionId, StartedAt, Status)
    VALUES (p_UserId, p_PositionId, NOW(), 'InProgress');

    SET p_NewSessionId = LAST_INSERT_ID();
END$$

DELIMITER ;
