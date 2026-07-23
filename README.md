# InterviewAI — Yapay Zeka Destekli Mülakat Koçu

InterviewAI, öğrencilerin ve iş arayanların hedefledikleri pozisyona göre
(Frontend Developer, Pazarlama Uzmanı vb.) yapay zeka ile simüle edilmiş
mülakatlar yapabildiği bir web uygulamasıdır. Mülakat sonunda kullanıcıya
**güçlü yönleri** ve **geliştirilmesi gereken yönleri** içeren bir rapor sunulur.

## Teknoloji Yığını

| Katman         | Teknoloji                         |
|----------------|------------------------------------|
| Backend        | ASP.NET Core 9 Web API (C#)        |
| Frontend       | React (Vite)                       |
| Veritabanı     | MySQL 8 (Stored Procedure tabanlı) |
| Veri Erişimi   | Dapper                             |
| Yapay Zeka     | Google Gemini API                  |

## Proje Yapısı

```
InterviewAI/
├── backend/
│   ├── InterviewAI.API/              → Controller'lar, Program.cs, appsettings
│   ├── InterviewAI.Application/      → Servisler, arayüzler, DTO'lar
│   ├── InterviewAI.Domain/           → Entity sınıfları
│   └── InterviewAI.Infrastructure/   → Dapper repository'leri, Gemini istemcisi
├── frontend/                          → React (Vite) uygulaması
├── database/
│   ├── schema.sql                     → Tablo tanımları
│   └── stored_procedures/             → Her işlem için ayrı .sql dosyası
└── docs/                              → Mimari notlar, API sözleşmesi
```

## Mimari Akış

```
React (Frontend)
   │  REST API (JSON)
   ▼
ASP.NET Core 9 Web API
   ├── Controllers
   ├── Application (Servisler)
   └── Infrastructure (Dapper + Gemini API)
   │
   ▼
MySQL (Stored Procedure'lar)
```

## Kurulum

### Backend
```bash
cd backend
dotnet restore
dotnet user-secrets init --project InterviewAI.API
dotnet user-secrets set "GeminiSettings:ApiKey" "GERÇEK_API_ANAHTARIN" --project InterviewAI.API
dotnet run --project InterviewAI.API
```

### Veritabanı
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p InterviewAIDb < database/stored_procedures/sp_CreateInterviewSession.sql
mysql -u root -p InterviewAIDb < database/stored_procedures/sp_SaveAnswer.sql
mysql -u root -p InterviewAIDb < database/stored_procedures/sp_GetSessionAnswers.sql
mysql -u root -p InterviewAIDb < database/stored_procedures/sp_InsertReport.sql
mysql -u root -p InterviewAIDb < database/stored_procedures/sp_GetQuestionsByPosition.sql
mysql -u root -p InterviewAIDb < database/stored_procedures/sp_GetPositions.sql
mysql -u root -p InterviewAIDb < database/stored_procedures/sp_RegisterUser.sql
mysql -u root -p InterviewAIDb < database/stored_procedures/sp_GetUserByEmail.sql
mysql -u root -p InterviewAIDb < database/seed_data.sql
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Yol Haritası

- [x] Proje mimarisi ve klasör yapısı
- [x] Veritabanı şeması ve temel stored procedure'lar
- [x] Backend iskeleti (Controller → Service → Repository katmanları)
- [x] Gemini API entegrasyon iskeleti
- [x] Frontend iskeleti (Vite + React)
- [x] Pozisyona göre soru havuzu ve uçtan uca mülakat akışı (pozisyon seç → soruları cevapla → rapor al)
- [ ] Kullanıcı kayıt/giriş (JWT)
- [ ] Gemini API yanıt parse mantığının tamamlanması
- [ ] Ses/konuşma analizi entegrasyonu (opsiyonel genişletme)
- [ ] Test kapsamı ve CI/CD

## Not

Bu proje bir staj/bitirme çalışması kapsamında geliştirilmektedir.
API anahtarları asla repoya commit edilmemeli; `dotnet user-secrets` veya
ortam değişkenleri (`.env`) kullanılmalıdır.
