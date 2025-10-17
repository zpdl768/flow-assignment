# 배포 가이드

이 문서는 프로젝트를 무료로 배포하는 방법을 설명합니다.

## 🚀 Render.com 배포 (추천)

Render.com은 무료로 Node.js + MySQL 애플리케이션을 배포할 수 있는 서비스입니다.

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

## 🌊 Railway.app 배포 (대안)

Railway는 설정이 더 간단하지만 무료 크레딧이 제한적입니다.

### 1단계: 계정 생성
1. [Railway.app](https://railway.app) 접속
2. GitHub 계정으로 로그인

### 2단계: 프로젝트 생성
1. "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. 저장소 선택

### 3단계: MySQL 추가
1. 프로젝트 대시보드에서 "New" → "Database" → "Add MySQL"
2. 자동으로 환경 변수 연결됨

### 4단계: 환경 변수 확인
Railway가 자동으로 다음 변수를 생성합니다:
- `MYSQL_URL`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

프로젝트의 환경 변수명과 일치하도록 매핑:
```
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_PORT=${{MySQL.MYSQL_PORT}}
PORT=3000
```

### 5단계: 데이터베이스 초기화
1. Railway 대시보드 → MySQL 서비스 → "Connect"
2. "Railway CLI" 설치
   ```bash
   npm install -g @railway/cli
   ```
3. 데이터베이스 초기화
   ```bash
   railway login
   railway connect
   mysql < server/models/db.sql
   ```

### 6단계: 배포 완료!

자동으로 URL이 생성됩니다: `https://your-app.up.railway.app`

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
