DELIMITER $$

CREATE PROCEDURE sp_RegisterUser(
    IN p_Name VARCHAR(150),
    IN p_Email VARCHAR(150),
    IN p_PasswordHash VARCHAR(255),
    OUT p_NewUserId INT
)
BEGIN
    INSERT INTO Users (Name, Email, PasswordHash, CreatedAt)
    VALUES (p_Name, p_Email, p_PasswordHash, NOW());

    SET p_NewUserId = LAST_INSERT_ID();
END$$

DELIMITER ;
