# 파일 업로드 시스템 - 확장자 차단 기능

파일 업로드 기능과 확장자 차단 시스템을 갖춘 웹 애플리케이션입니다.

## 📋 프로젝트 개요

- **기술 스택**: Node.js, Express.js, MySQL, HTML5, CSS3, Vanilla JavaScript
- **주요 기능**:
  - 드래그 앤 드롭 및 파일 선택을 통한 파일 업로드
  - 고정 확장자 차단 설정 (새로고침 시에도 유지)
  - 커스텀 확장자 추가/삭제 (최대 200개)
  - RESTful API 구조

## 🌐 라이브 데모

👉 **[여기를 클릭하여 바로 확인하기](#)** (배포 후 링크 업데이트)

---

## 🚀 시작하기

## 🐳 Docker로 빠르게 실행 (권장)

Docker와 Docker Compose만 설치되어 있으면 **한 번의 명령어로** 실행 가능합니다.

### 사전 요구사항
- Docker Desktop 설치

### 실행 방법
```bash
# 1. 저장소 클론
git clone <repository-url>
cd flow-assignment

# 2. Docker Compose로 실행 (MySQL + Node.js 앱 모두 자동 실행)
docker-compose up

# 3. 브라우저에서 접속
# http://localhost:3000
```

**끝!** MySQL 설치, 데이터베이스 생성, 환경 변수 설정이 모두 자동으로 처리됩니다.

### 종료 방법
```bash
# Ctrl+C 또는
docker-compose down
```

---

## 💻 수동 설치 및 실행 (Docker 없이)

### 사전 요구사항

- Node.js (v14 이상)
- MySQL (v5.7 이상 또는 v8.0)
- npm 또는 yarn

### 설치 및 실행

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd flow-assignment
```

#### 2. 의존성 패키지 설치

```bash
npm install
```

#### 3. MySQL 데이터베이스 설정

MySQL에 접속하여 데이터베이스를 생성하고 테이블을 설정합니다:

```bash
mysql -u root -p < server/models/db.sql
```

또는 MySQL 클라이언트에서 직접 실행:

```sql
source server/models/db.sql
```

#### 4. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 MySQL 연결 정보를 입력합니다:

```bash
cp .env.example .env
```

`.env` 파일을 열고 MySQL 비밀번호를 수정합니다:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password  # <- 여기에 실제 비밀번호 입력
DB_NAME=file_upload_db
DB_PORT=3306

# Server Configuration
PORT=3000
```

#### 5. 서버 실행

```bash
npm start
```

개발 모드 (nodemon 사용):

```bash
npm run dev
```

#### 6. 브라우저에서 접속

```
http://localhost:3000
```

## 📁 프로젝트 구조

```
flow-assignment/
├── server/
│   ├── config/
│   │   └── database.js          # MySQL 연결 설정
│   ├── routes/
│   │   ├── extensions.js        # 확장자 관련 API 라우트
│   │   └── upload.js            # 파일 업로드 API 라우트
│   ├── controllers/
│   │   ├── extensionController.js  # 확장자 로직
│   │   └── uploadController.js     # 파일 업로드 로직
│   ├── models/
│   │   └── db.sql               # 데이터베이스 스키마
│   └── server.js                # Express 서버 진입점
├── public/
│   ├── index.html               # 메인 HTML
│   ├── style.css                # 스타일시트
│   └── script.js                # 클라이언트 JavaScript
├── uploads/                     # 업로드된 파일 저장소
├── .env                         # 환경 변수
├── .gitignore                   # Git 제외 파일
├── package.json                 # 프로젝트 설정
└── README.md                    # 프로젝트 문서
```

## 🔧 API 엔드포인트

### 확장자 관련

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/extensions/fixed` | 고정 확장자 목록 조회 |
| `PUT` | `/api/extensions/fixed/:id` | 고정 확장자 차단 상태 변경 |
| `GET` | `/api/extensions/custom` | 커스텀 확장자 목록 조회 |
| `POST` | `/api/extensions/custom` | 커스텀 확장자 추가 |
| `DELETE` | `/api/extensions/custom/:id` | 커스텀 확장자 삭제 |
| `GET` | `/api/extensions/blocked` | 모든 차단된 확장자 조회 |

### 파일 업로드

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/api/upload` | 파일 업로드 (확장자 검증 포함) |

## ✨ 주요 기능

### 1. 파일 업로드

- **드래그 앤 드롭**: 파일을 드래그하여 업로드 영역에 놓기
- **파일 선택**: 클릭하여 파일 탐색기에서 선택
- **크기 제한**: 최대 10MB
- **확장자 검증**: 차단된 확장자는 업로드 불가

### 2. 고정 확장자 관리

- 기본 제공 확장자: `bat`, `cmd`, `com`, `cpl`, `exe`, `scr`, `js`
- 체크박스로 차단 상태 토글
- **상태 유지**: 페이지 새로고침 시에도 설정 유지 (DB 저장)

### 3. 커스텀 확장자 관리

- 사용자 정의 확장자 추가
- **검증 기능**:
  - 최대 길이: 20자
  - 중복 확인 (고정 + 커스텀)
  - 최대 개수: 200개
- X 버튼으로 삭제

## 🗄️ 데이터베이스 스키마

### fixed_extensions 테이블
```sql
CREATE TABLE fixed_extensions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### custom_extensions 테이블
```sql
CREATE TABLE custom_extensions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 보안 고려사항

- 파일 확장자 대소문자 구분 없이 검증
- SQL Injection 방지 (Prepared Statements 사용)
- 파일 크기 제한 (10MB)
- 차단된 확장자 파일 자동 삭제
- CORS 설정

## 🧪 테스트 방법

1. 서버 실행 후 브라우저에서 `http://localhost:3000` 접속
2. 고정 확장자 체크박스 선택/해제 후 새로고침하여 상태 유지 확인
3. 커스텀 확장자 추가 및 삭제 테스트
4. 차단된 확장자 파일 업로드 시도 (업로드 실패 확인)
5. 허용된 확장자 파일 업로드 (업로드 성공 확인)

## 📝 개발 환경

- **Node.js**: v18.x
- **Express**: v4.18.2
- **MySQL**: v8.0
- **Multer**: v2.0.0-rc.4

## 🐛 문제 해결

### MySQL 연결 오류
```
⚠️ 데이터베이스 연결에 실패했습니다.
```
- `.env` 파일의 MySQL 연결 정보 확인
- MySQL 서버 실행 여부 확인
- 데이터베이스 생성 여부 확인

### 포트 충돌
```
Error: listen EADDRINUSE: address already in use :::3000
```
- `.env` 파일에서 `PORT` 변경
- 또는 기존 프로세스 종료

## 📄 라이선스

ISC

## 👨‍💻 개발자

김여명

---

**Note**: 이 프로젝트는 마드라스체크 회사의 서버 개발자 과제를 위해 개발되었습니다.
