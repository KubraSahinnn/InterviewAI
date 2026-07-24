USE InterviewAIDb;

INSERT INTO Positions (Title, Description) VALUES
    ('Frontend Developer', 'React/Vue tabanlı arayüz geliştirme pozisyonu'),
    ('Pazarlama Uzmanı', 'Dijital pazarlama ve marka yönetimi pozisyonu'),
    ('Backend Developer', '.NET/Java tabanlı sunucu tarafı geliştirme pozisyonu');

-- Frontend Developer soruları (PositionId = 1)
INSERT INTO InterviewQuestions (PositionId, QuestionText, QuestionType) VALUES
    (1, 'React''te state ve props arasındaki farkı açıklar mısın?', 'Teknik'),
    (1, 'Bir projede performans sorunuyla karşılaştığında nasıl bir yaklaşım izlersin?', 'Teknik'),
    (1, 'Takım içinde bir kod inceleme (code review) sürecinde anlaşmazlık yaşadığın bir durumu anlatır mısın?', 'Davranışsal'),
    (1, 'Kendini 3 kelimeyle nasıl tanımlarsın ve neden?', 'Genel');

-- Pazarlama Uzmanı soruları (PositionId = 2)
INSERT INTO InterviewQuestions (PositionId, QuestionText, QuestionType) VALUES
    (2, 'Bir dijital pazarlama kampanyasının başarısını hangi metriklerle ölçersin?', 'Teknik'),
    (2, 'Bütçesi kısıtlı bir kampanyada önceliklendirmeyi nasıl yaparsın?', 'Davranışsal'),
    (2, 'Son zamanlarda dikkatini çeken bir marka kampanyası var mı, neden etkiledi?', 'Genel');

-- Backend Developer soruları (PositionId = 3)
INSERT INTO InterviewQuestions (PositionId, QuestionText, QuestionType) VALUES
    (3, 'Stored procedure kullanmanın ORM''e göre avantaj ve dezavantajları nelerdir?', 'Teknik'),
    (3, 'Yüksek trafikli bir API''de performans darboğazını nasıl tespit edersin?', 'Teknik'),
    (3, 'Bir deadline''ı kaçırma riskiyle karşılaştığında ne yaparsın?', 'Davranışsal');
