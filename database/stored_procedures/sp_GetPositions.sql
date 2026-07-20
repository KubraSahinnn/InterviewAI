DELIMITER $$

CREATE PROCEDURE sp_GetPositions()
BEGIN
    SELECT Id, Title, Description
    FROM Positions
    ORDER BY Title ASC;
END$$

DELIMITER ;
