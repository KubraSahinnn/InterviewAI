-- InterviewAI Veritabanı Şeması
CREATE DATABASE IF NOT EXISTS InterviewAIDb
    CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

USE InterviewAIDb;

CREATE TABLE Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Positions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(150) NOT NULL,
    Description TEXT
);

CREATE TABLE InterviewSessions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    PositionId INT NOT NULL,
    StartedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    EndedAt DATETIME NULL,
    Status VARCHAR(30) NOT NULL DEFAULT 'InProgress',
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (PositionId) REFERENCES Positions(Id)
);

CREATE TABLE InterviewQuestions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PositionId INT NOT NULL,
    QuestionText TEXT NOT NULL,
    QuestionType VARCHAR(50),
    FOREIGN KEY (PositionId) REFERENCES Positions(Id)
);

CREATE TABLE InterviewAnswers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    SessionId INT NOT NULL,
    QuestionId INT NOT NULL,
    AnswerText TEXT NOT NULL,
    AnswerDurationSeconds INT DEFAULT 0,
    FOREIGN KEY (SessionId) REFERENCES InterviewSessions(Id),
    FOREIGN KEY (QuestionId) REFERENCES InterviewQuestions(Id)
);

CREATE TABLE InterviewReports (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    SessionId INT NOT NULL,
    Strengths TEXT,
    AreasToImprove TEXT,
    OverallScore DECIMAL(5,2),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SessionId) REFERENCES InterviewSessions(Id)
);
