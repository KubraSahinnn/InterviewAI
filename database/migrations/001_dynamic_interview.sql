-- Dinamik (yapay zeka tarafından anlık üretilen) mülakat soruları desteği için
-- InterviewAnswers tablosunu genişletiyoruz. QuestionId artık zorunlu değil;
-- dinamik akışta soru metni doğrudan bu tabloda saklanır.

USE InterviewAIDb;

ALTER TABLE InterviewAnswers
    MODIFY QuestionId INT NULL;

ALTER TABLE InterviewAnswers
    ADD COLUMN QuestionNumber INT NULL AFTER QuestionId,
    ADD COLUMN QuestionText TEXT NULL AFTER QuestionNumber;
