# 파일 업로드 시스템 - 확장자 차단 기능

> **마드라스체크 서버 개발자 과제**
> Node.js + Express + MySQL을 활용한 파일 확장자 차단 시스템

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

## 🔌 API 명세

### 확장자 관리 API

| Method | Endpoint | 설명 | Request | Response |
|--------|----------|------|---------|----------|
| `GET` | `/api/extensions/fixed` | 고정 확장자 목록 조회 | - | `[{id, name, is_blocked}]` |
| `PUT` | `/api/extensions/fixed/:id` | 고정 확장자 차단 상태 변경 | `{is_blocked: boolean}` | `{success, message}` |
| `GET` | `/api/extensions/custom` | 커스텀 확장자 목록 조회 | - | `[{id, name}]` |
| `POST` | `/api/extensions/custom` | 커스텀 확장자 추가 | `{name: string}` | `{success, message, id}` |
| `DELETE` | `/api/extensions/custom/:id` | 커스텀 확장자 삭제 | - | `{success, message}` |
| `GET` | `/api/extensions/blocked` | 차단된 모든 확장자 조회 | - | `{blocked: [string]}` |

### 파일 업로드 API

| Method | Endpoint | 설명 | Request | Response |
|--------|----------|------|---------|----------|
| `POST` | `/api/upload` | 파일 업로드 (확장자 검증 포함) | `multipart/form-data` | `{success, message, file}` |

#### 업로드 응답 예시

**성공:**
```json
{
  "success": true,
  "message": "파일이 성공적으로 업로드되었습니다.",
  "file": {
    "filename": "abc123.png",
    "originalname": "image.png",
    "size": 1024567
  }
}
```

**실패 (차단된 확장자):**
```json
{
  "success": false,
  "message": "exe 확장자는 차단되어 업로드할 수 없습니다."
}
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

### 테이블 스키마

#### fixed_extensions
```sql
CREATE TABLE fixed_extensions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,      -- 확장자명
    is_blocked BOOLEAN DEFAULT FALSE,      -- 차단 여부
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_blocked (is_blocked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### custom_extensions
```sql
CREATE TABLE custom_extensions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,      -- 확장자명
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

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

5. **환경 변수 관리**
   - `.env` 파일로 민감 정보 분리
   - `.gitignore`로 버전 관리 제외

---

## 🧪 테스트 시나리오

### 1. 고정 확장자 테스트
1. 초기 상태 확인 (모두 체크 해제)
2. `exe` 확장자 체크
3. 페이지 새로고침
4. ✅ `exe` 체크 상태 유지 확인

### 2. 커스텀 확장자 테스트
1. `pdf` 확장자 추가
2. 중복으로 `pdf` 추가 시도
3. ❌ "이미 존재하는 확장자입니다" 오류 확인
4. `pdf` 삭제
5. ✅ 목록에서 제거 확인

### 3. 파일 업로드 테스트
1. `exe` 확장자 차단
2. `test.exe` 파일 업로드 시도
3. ❌ "차단된 확장자" 오류 확인
4. `image.png` 파일 업로드
5. ✅ 업로드 성공 확인
6. `uploads/` 폴더에 파일 저장 확인

---


## 📄 라이선스

ISC

---

## 👨‍💻 개발자

**김여명**
GitHub: [@zpdl768](https://github.com/zpdl768)

---

## 📌 프로젝트 정보

- **과제 제공**: 마드라스체크
- **포지션**: 서버 개발자
- **저장소**: https://github.com/zpdl768/flow-assignment

---

**Thank you for reviewing my project! 🙏**
