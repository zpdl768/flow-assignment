# 배포 가이드

> Railway를 통한 무료 배포 가이드 - 5분이면 완료!

---

## 👔 채용담당자님 빠른 가이드

### ⚡ Railway 5분 배포 요약

Railway는 가장 간단한 배포 방법입니다. **데이터베이스 초기화가 자동**으로 처리됩니다!

**1단계: Railway 로그인 (30초)**
1. [Railway.app](https://railway.app) 접속
2. "Login with GitHub" 클릭

**2단계: 프로젝트 배포 (1분)**
1. "New Project" → "Deploy from GitHub repo"
2. `flow-assignment` 저장소 선택
3. "Deploy Now" 클릭

**3단계: MySQL 추가 (30초)**
1. 프로젝트에서 "New" → "Database" → "Add MySQL"
2. 자동으로 MySQL 생성됨

**4단계: 환경 변수 연결 (2분)**
1. 애플리케이션 서비스 선택 → "Variables" 탭
2. 다음 변수 추가:
```env
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_PORT=${{MySQL.MYSQL_PORT}}
```

**5단계: 공개 URL 생성 (30초)**
1. "Settings" 탭 → "Networking" → "Generate Domain"
2. URL 생성 완료!

**6단계: 자동 배포 & DB 초기화 (1분)**
- 환경 변수 저장 시 자동으로 재배포
- 서버 시작 시 **DB 테이블 자동 생성**
- 고정 확장자 초기 데이터 자동 삽입

**✅ 배포 완료!**
생성된 URL로 접속하여 동작 확인

---

### 📖 상세 가이드

아래의 단계별 가이드에서 더 자세한 내용을 확인하실 수 있습니다.

---

## 🚀 Render.com 배포 (대안)

Render.com은 무료로 Node.js + MySQL 애플리케이션을 배포할 수 있는 서비스입니다.
(참고: Railway보다 설정이 복잡하므로 Railway 사용을 권장합니다)

### 1단계: 계정 생성
1. [Render.com](https://render.com) 접속
2. GitHub 계정으로 로그인

### 2단계: MySQL 데이터베이스 생성

**참고**: Render 무료 플랜에는 MySQL이 없으므로 **PlanetScale** (무료 MySQL 호스팅)을 사용합니다.

#### PlanetScale 설정
1. [PlanetScale](https://planetscale.com) 접속 및 가입
2. "New database" 클릭
3. Database name: `file-upload-db`
4. Region: `AWS / US East` 선택
5. Create database
6. "Connect" → "Create password" 클릭
7. **연결 정보 복사** (Host, Username, Password)

### 3단계: Render에서 웹 서비스 생성

1. Render Dashboard → "New +" → "Web Service"
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `file-upload-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. **환경 변수 설정** (Add Environment Variable):
   ```
   DB_HOST=<planetscale-host>
   DB_USER=<planetscale-username>
   DB_PASSWORD=<planetscale-password>
   DB_NAME=file_upload_db
   DB_PORT=3306
   PORT=3000
   ```

5. "Create Web Service" 클릭

### 4단계: 데이터베이스 초기화

PlanetScale 대시보드에서:
1. "Console" 탭 클릭
2. `db.sql` 파일 내용 복사하여 실행
3. 또는 로컬에서 연결:
   ```bash
   mysql -h <host> -u <user> -p --ssl-mode=REQUIRED < server/models/db.sql
   ```

### 5단계: 배포 완료!

배포된 URL: `https://file-upload-app.onrender.com`

이 URL을 README.md의 라이브 데모 링크에 업데이트하세요!

---

## 🌊 Railway.app 배포 (대안) ⭐ 추천!

Railway는 설정이 가장 간단하고 MySQL이 기본 제공됩니다. 데이터베이스 초기화가 자동으로 처리됩니다!

### ✨ 주요 장점
- ✅ **완전 자동 배포**: GitHub 연동 후 자동 빌드 & 배포
- ✅ **자동 DB 초기화**: 테이블 생성 및 초기 데이터 삽입 자동 처리
- ✅ **MySQL 기본 제공**: 별도 서비스 불필요
- ✅ **간단한 환경 변수**: 자동 연결 지원

---

### 📋 단계별 배포 가이드

#### 1단계: Railway 계정 생성 (1분)

1. [Railway.app](https://railway.app) 접속
2. **"Login"** 클릭 → **"Login with GitHub"** 선택
3. GitHub 계정으로 로그인 및 권한 승인

#### 2단계: 새 프로젝트 생성 (2분)

1. Railway 대시보드에서 **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. 저장소 검색 후 **`flow-assignment`** 선택
4. **"Deploy Now"** 클릭

✅ Railway가 자동으로 감지합니다:
- Node.js 프로젝트 인식
- `package.json`의 `npm start` 명령어 사용
- 자동 빌드 및 배포 시작

#### 3단계: MySQL 데이터베이스 추가 (1분)

1. 프로젝트 대시보드에서 **"New"** 버튼 클릭
2. **"Database"** → **"Add MySQL"** 선택
3. 자동으로 MySQL 서비스 생성 완료!

✅ Railway가 자동으로:
- MySQL 8.0 인스턴스 생성
- 연결 정보 생성 (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD` 등)

#### 4단계: 환경 변수 연결 (2분)

애플리케이션 서비스 선택 → **"Variables"** 탭 클릭

**자동 생성된 MySQL 변수를 프로젝트 변수명과 매핑:**

```env
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_PORT=${{MySQL.MYSQL_PORT}}
```

**또는 직접 입력:**
```env
DB_HOST=<MySQL 서비스의 MYSQL_HOST 값 복사>
DB_USER=<MySQL 서비스의 MYSQL_USER 값 복사>
DB_PASSWORD=<MySQL 서비스의 MYSQL_PASSWORD 값 복사>
DB_NAME=<MySQL 서비스의 MYSQL_DATABASE 값 복사>
DB_PORT=<MySQL 서비스의 MYSQL_PORT 값 복사>
```

💡 **팁**: MySQL 서비스 클릭 → "Variables" 탭에서 연결 정보 확인 가능

#### 5단계: 공개 URL 설정 (1분)

1. 애플리케이션 서비스 선택
2. **"Settings"** 탭 클릭
3. **"Networking"** 섹션에서 **"Generate Domain"** 클릭
4. 자동으로 공개 URL 생성: `https://your-app-name.up.railway.app`

#### 6단계: 자동 재배포 & DB 초기화 (1분)

환경 변수 저장 시 Railway가 자동으로:
1. ✅ 애플리케이션 재배포
2. ✅ 서버 시작 시 DB 초기화 스크립트 자동 실행
   - `fixed_extensions` 테이블 생성
   - `custom_extensions` 테이블 생성
   - 고정 확장자 7개 초기 데이터 삽입

#### 7단계: 배포 완료! 🎉

생성된 URL로 접속하여 확인:
```
https://your-app-name.up.railway.app
```

**확인 사항:**
- ✅ 메인 페이지 로딩
- ✅ 고정 확장자 7개 표시 (bat, cmd, com, cpl, exe, scr, js)
- ✅ 파일 업로드 기능
- ✅ 커스텀 확장자 추가/삭제

---

### 🔍 배포 상태 확인

#### 로그 확인
1. 애플리케이션 서비스 클릭
2. **"Deployments"** 탭
3. 최신 배포 클릭 → **"View Logs"**

**정상 배포 시 로그:**
```
✅ MySQL 데이터베이스 연결 성공
🔧 데이터베이스 초기화 시작...
✅ fixed_extensions 테이블 생성/확인 완료
✅ custom_extensions 테이블 생성/확인 완료
✅ 고정 확장자 초기 데이터 삽입 완료
🎉 데이터베이스 초기화 완료!
🚀 서버가 포트 3000에서 실행 중입니다.
```

#### MySQL 데이터 확인 (선택사항)
1. MySQL 서비스 클릭
2. **"Data"** 탭에서 테이블 확인
3. 또는 **"Query"** 탭에서 직접 쿼리:
   ```sql
   SHOW TABLES;
   SELECT * FROM fixed_extensions;
   SELECT * FROM custom_extensions;
   ```

---

### 🔄 자동 재배포 설정

Railway는 GitHub과 자동 연동됩니다:

1. **자동 배포 활성화** (기본값):
   - `main` 브랜치에 push 시 자동 배포
   - Settings → "Deployment" → "Triggers" 확인

2. **코드 수정 후 배포:**
   ```bash
   git add .
   git commit -m "feat: 새 기능 추가"
   git push origin main
   ```
   → Railway가 자동으로 감지하고 재배포

3. **수동 재배포:**
   - Deployments 탭 → "Deploy" 버튼 클릭

---

### 💡 알아두면 좋은 점

#### 무료 플랜 제한
- **월 $5 무료 크레딧** 제공 (약 500시간 실행)
- 학생은 **GitHub Student Pack**으로 $10/월 추가 크레딧
- 크레딧 소진 시 서비스 일시 중지 (데이터 보존)

#### 파일 업로드 주의사항
- Railway는 **임시 파일 시스템** 사용
- 재배포 시 `uploads/` 폴더 내 파일 **자동 삭제**
- 테스트/데모 목적으로는 문제없음
- 프로덕션 환경에서는 S3 같은 외부 스토리지 권장

#### 성능 최적화
- 무료 플랜도 충분히 빠름 (슬립 모드 없음)
- 자동 SSL 인증서 제공 (HTTPS)
- 글로벌 CDN 지원

---

### 🐛 문제 해결

#### ❌ "Application failed to respond"
- **원인**: 환경 변수 미설정 또는 DB 연결 실패
- **해결**: Variables 탭에서 DB 연결 정보 확인

#### ❌ "Deployment failed"
- **원인**: 빌드 오류 또는 시작 명령어 오류
- **해결**: Logs에서 오류 메시지 확인, `package.json`의 `start` 스크립트 확인

#### ❌ 테이블이 생성되지 않음
- **원인**: DB 초기화 스크립트 실행 실패
- **해결**:
  1. Logs에서 초기화 로그 확인
  2. MySQL "Query" 탭에서 수동 실행:
     ```sql
     source /app/server/models/db.sql
     ```

#### 🔧 Railway CLI로 직접 연결 (고급)
```bash
# CLI 설치
npm install -g @railway/cli

# 로그인 및 프로젝트 연결
railway login
railway link

# MySQL 쉘 접속
railway connect MySQL

# 데이터 확인
SHOW TABLES;
SELECT * FROM fixed_extensions;
```

---

## 💡 중요 사항

### 무료 플랜 제한사항

**Render.com**:
- 15분 동안 요청이 없으면 슬립 모드로 전환
- 첫 요청 시 웨이크업에 30초~1분 소요
- 월 750시간 무료 (항상 켜둘 수 있음)

**Railway.app**:
- 월 $5 무료 크레딧 제공
- 크레딧 소진 시 서비스 중지

**PlanetScale**:
- 1개 데이터베이스 무료
- 5GB 스토리지
- 10억 row reads/월

### 배포 후 할 일

1. ✅ 배포된 URL을 README.md의 "🌐 라이브 데모" 섹션에 업데이트
2. ✅ 웹사이트 접속 테스트
3. ✅ 파일 업로드 기능 테스트
4. ✅ 고정/커스텀 확장자 기능 테스트
5. ✅ GitHub URL을 채용담당자에게 제출

### 문제 해결

**슬립 모드 방지 (선택사항)**:
- [UptimeRobot](https://uptimerobot.com) 같은 무료 모니터링 서비스로 5분마다 핑 보내기
- 서버가 계속 깨어있도록 유지

**로그 확인**:
- Render: Dashboard → Logs 탭
- Railway: Dashboard → Deployments → 로그 확인

---

## 📝 채용담당자를 위한 안내

README.md에 다음 섹션을 추가하는 것을 추천합니다:

```markdown
## 📌 채용담당자님께

### 빠른 확인 방법
1. **라이브 데모**: 위의 링크를 클릭하면 즉시 확인 가능합니다
2. **Docker 실행**: 로컬에서 `docker-compose up` 한 번만 실행하면 됩니다

### 주요 확인 포인트
- ✅ RESTful API 설계
- ✅ MySQL 데이터베이스 연동
- ✅ 파일 업로드 처리 (Multer)
- ✅ 반응형 UI/UX
- ✅ Docker 컨테이너화
- ✅ 배포 경험
```

---

**참고**: 무료 서비스이므로 성능은 제한적일 수 있지만, 기능 확인에는 충분합니다.
