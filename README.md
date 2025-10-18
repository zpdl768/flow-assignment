# 파일 업로드 시스템 - 확장자 차단 기능


## 📌 프로젝트 정보

- **포지션**: 서버 개발자
- **기술 요약**: Node.js + Express + MySQL을 활용한 파일 확장자 차단 시스템
- **저장소**: https://github.com/zpdl768/flow-assignment

---

## 👔 채용 담당자께

### ⚡ 빠른 확인 방법

👉 **[배포된 사이트 바로 확인하기](https://flow-assignment-production.up.railway.app)

Railway에 배포된 실제 동작 환경을 즉시 확인하실 수 있습니다.

---

### 🎯 과제 요구사항 구현 내용

#### ✅ 필수 구현 사항
- **확장자 차단**: 고정 확장자 7개 + 커스텀 확장자 최대 200개
- **상태 유지**: MySQL DB 저장으로 새로고침 시에도 설정 유지
- **RESTful API**: 표준 REST 규약 준수
- **확장자 최대 입력 길이**: 커스텀 확장자의 최대 입력 길이를 20자로 제한
- **커스텀 확장자 추가, 삭제**: 커스텀 확장자 추가/삭제 가능 + DB에서도 같이 추가/삭제

#### 💎 추가 구현 사항
- **반응형 UI/UX**: 드래그 앤 드롭 기능 + 파일 선택 기능
- **실시간 검증**: 클라이언트/서버 이중 검증
- **보안 강화**: SQL Injection 방지, 파일 크기 제한
- **Docker 컨테이너화**: 한 번에 실행 가능한 환경
- **자동 DB 초기화**: 배포 시 테이블 자동 생성
- **클라우드 배포**: Railway 무료 호스팅

#### 💡 추가로 고려한 사항
- ****:


---

## 📋 프로젝트 개요

### 기술 스택
- **Backend**: Node.js 18, Express.js 4.18
- **Database**: MySQL 8.0
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **File Upload**: Multer 2.0
- **Deployment**: Docker, Railway

### 핵심 기능
- ✅ 파일 업로드 (드래그 앤 드롭 + 파일 선택)
- ✅ 고정 확장자 차단 설정 (새로고침 시에도 유지)
- ✅ 커스텀 확장자 추가/삭제 (최대 200개)
- ✅ RESTful API 구조
- ✅ 보안 검증 (SQL Injection 방지, 파일 크기 제한)

---

## 📁 프로젝트 구조

```
flow-assignment/
├── server/
│   ├── config/
│   │   ├── database.js          # MySQL 연결 풀 설정
│   │   └── initDB.js            # DB 자동 초기화 스크립트 (신규)
│   ├── controllers/
│   │   ├── extensionController.js  # 확장자 비즈니스 로직
│   │   └── uploadController.js     # 파일 업로드 비즈니스 로직
│   ├── routes/
│   │   ├── extensions.js        # 확장자 API 라우트
│   │   └── upload.js            # 업로드 API 라우트
│   ├── models/
│   │   └── db.sql               # 데이터베이스 스키마
│   └── server.js                # Express 서버 진입점
├── public/
│   ├── index.html               # 메인 페이지
│   ├── style.css                # 스타일시트
│   └── script.js                # 클라이언트 로직
├── uploads/                     # 업로드 파일 저장소
├── docker-compose.yml           # Docker Compose 설정
├── railway.json                 # Railway 배포 설정 (신규)
├── .env.example                 # 환경 변수 템플릿
└── package.json                 # 프로젝트 설정
```

---

## 🗄️ 데이터베이스 설계

### ERD

```
┌─────────────────────────┐      ┌─────────────────────────┐
│   fixed_extensions      │      │   custom_extensions     │
├─────────────────────────┤      ├─────────────────────────┤
│ id (PK)                 │      │ id (PK)                 │
│ name (UNIQUE)           │      │ name (UNIQUE)           │
│ is_blocked (BOOLEAN)    │      │ created_at              │
│ created_at              │      └─────────────────────────┘
│ updated_at              │
└─────────────────────────┘
```

## 🔐 보안 고려사항

### 구현된 보안 기능

1. **SQL Injection 방지**
   - Prepared Statements 사용
   - 사용자 입력 파라미터화

2. **파일 업로드 보안**
   - 확장자 검증 (대소문자 무관)
   - 파일 크기 제한 (10MB)
   - 차단 확장자 파일 자동 삭제
   - 안전한 파일명 생성 (UUID)

3. **입력 값 검증**
   - 확장자 길이 제한 (20자)
   - 특수문자 필터링
   - 중복 확인

4. **CORS 설정**
   - 허용된 origin만 접근 가능

---

## 👨‍💻 개발자

**김여명**
GitHub: [@zpdl768](https://github.com/zpdl768)

---

**Thank you for reviewing my project! 🙏**
