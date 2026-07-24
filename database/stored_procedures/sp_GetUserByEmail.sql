DELIMITER $$

CREATE PROCEDURE sp_GetUserByEmail(
    IN p_Email VARCHAR(150)
)
BEGIN
    SELECT Id, Name, Email, PasswordHash, CreatedAt
    FROM Users
    WHERE Email = p_Email
    LIMIT 1;
END$$

DELIMITER ;
