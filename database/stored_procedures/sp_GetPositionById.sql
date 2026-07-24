DELIMITER $$

CREATE PROCEDURE sp_GetPositionById(
    IN p_PositionId INT
)
BEGIN
    SELECT Id, Title, Description
    FROM Positions
    WHERE Id = p_PositionId
    LIMIT 1;
END$$

DELIMITER ;
