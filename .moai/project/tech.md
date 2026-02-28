# PostgreSQL 스터디 사이트 - 기술 스택

## 현재 상태

> 프로젝트가 초기 기획 단계입니다. 아래에 기술된 스택은 후보 옵션이며, 팀 논의와 프로토타입 검증을 통해 확정될 예정입니다.

---

## 기술 스택 선택 기준

당근마켓과 토스의 기술 선택 원칙을 참고하여, 다음 기준으로 기술을 평가합니다.

1. **생산성**: 소규모 팀이 빠르게 개발하고 배포할 수 있는가
2. **성능**: 사용자가 빠른 로딩 속도를 경험할 수 있는가
3. **유지보수성**: 장기적으로 관리하기 쉬운 코드베이스를 만들 수 있는가
4. **생태계**: 활발한 커뮤니티와 풍부한 레퍼런스가 존재하는가
5. **확장성**: 기능 추가 시 아키텍처를 크게 바꾸지 않아도 되는가

---

## 권장 기술 스택 (Tier 1 후보)

### 프론트엔드 프레임워크

**Next.js 15 (App Router)**

현재 가장 강력하게 추천하는 옵션입니다. 토스와 당근마켓 모두 Next.js를 주력으로 사용하고 있으며, 문서 사이트에 필요한 정적 생성(SSG), 동적 렌더링, 이미지 최적화를 모두 지원합니다.

- 공식 사이트: https://nextjs.org
- 버전: 15.x (최신 안정 버전)
- 주요 이유: React 생태계, Vercel 배포 최적화, App Router의 서버 컴포넌트

**대안**: Remix, Astro (콘텐츠 사이트 특화)

### 문서 프레임워크

**Nextra 3.x**

Next.js 위에서 동작하는 문서 사이트 프레임워크입니다. MDX 파일을 자동으로 라우팅하고, 사이드바, 목차, 검색 기능을 기본 제공합니다.

- 공식 사이트: https://nextra.site
- 버전: 3.x 또는 4.x (App Router 지원)
- 주요 이유: 문서 사이트에 최적화, MDX 네이티브 지원, 빠른 셋업

**대안**: Docusaurus (React 기반), VitePress (Vue 기반)

### 언어

**TypeScript 5.x**

JavaScript 대신 TypeScript를 기본으로 사용합니다. 컴포넌트 props, API 응답 타입을 명시적으로 관리할 수 있어 장기 유지보수에 유리합니다.

- 버전: 5.x (최신 안정 버전)
- 설정: strict 모드 활성화

### 스타일링

**Tailwind CSS 4.x**

유틸리티 클래스 기반 스타일링으로, 당근마켓과 토스가 채택한 CSS-in-JS 대신 빌드 타임에 스타일을 생성합니다. 디자인 시스템 토큰 관리에 적합합니다.

- 공식 사이트: https://tailwindcss.com
- 버전: 4.x
- 주요 이유: 빠른 개발 속도, 일관된 디자인 시스템 적용

**대안**: CSS Modules, vanilla-extract (타입 안전 CSS)

---

## 핵심 의존성

### 콘텐츠 처리

| 패키지 | 용도 | 버전 |
|---|---|---|
| `next-mdx-remote` 또는 `@next/mdx` | MDX 파일 파싱 및 렌더링 | 최신 |
| `rehype-pretty-code` | 코드 블록 문법 강조 (Shiki 기반) | 최신 |
| `remark-gfm` | GitHub Flavored Markdown 확장 | 최신 |
| `rehype-slug` | 헤딩 자동 앵커 생성 | 최신 |
| `rehype-autolink-headings` | 헤딩 링크 자동 추가 | 최신 |

### 검색

| 패키지 | 용도 | 버전 |
|---|---|---|
| `flexsearch` | 클라이언트 사이드 전문 검색 | 최신 |
| `fuse.js` | 퍼지 검색 (대안) | 최신 |

### UI 컴포넌트

| 패키지 | 용도 | 버전 |
|---|---|---|
| `@radix-ui/react-*` | 접근성 준수 헤드리스 컴포넌트 | 최신 |
| `lucide-react` | 아이콘 라이브러리 | 최신 |
| `next-themes` | 다크/라이트 테마 전환 | 최신 |

### 개발 도구

| 패키지 | 용도 | 버전 |
|---|---|---|
| `eslint` + `eslint-config-next` | 코드 린팅 | 최신 |
| `prettier` | 코드 포맷팅 | 최신 |
| `husky` | Git 훅 관리 | 최신 |
| `lint-staged` | 스테이징 파일 린팅 | 최신 |

### 테스트 (향후)

| 패키지 | 용도 | 버전 |
|---|---|---|
| `vitest` | 단위/통합 테스트 | 최신 |
| `@testing-library/react` | 컴포넌트 테스트 | 최신 |
| `playwright` | E2E 테스트 | 최신 |

---

## 인터랙티브 실습 환경 (향후)

PostgreSQL 쿼리를 브라우저에서 직접 실행하는 기능을 위한 옵션입니다.

### 옵션 A: PGlite (추천)

WebAssembly로 컴파일된 PostgreSQL로, 백엔드 없이 브라우저에서 PostgreSQL을 실행합니다.

- 공식 사이트: https://pglite.dev
- 장점: 백엔드 불필요, PostgreSQL 완전 호환, 오프라인 지원
- 단점: 초기 로딩 시간 (약 1-2MB WASM 파일)
- 적합한 시점: MVP 이후, 실습 기능 추가 시

### 옵션 B: 백엔드 API

전용 PostgreSQL 인스턴스와 API를 통해 쿼리를 실행합니다.

- 장점: 실제 PostgreSQL 환경, 고급 기능 모두 지원
- 단점: 서버 비용, 쿼리 샌드박스 보안 필요
- 적합한 시점: 사용자 인증 및 진도 관리와 함께 도입

---

## 개발 환경

### 필수 요구사항

```
Node.js: 20.x LTS 이상
npm / pnpm / yarn: 패키지 매니저 (pnpm 권장)
Git: 2.x 이상
```

### 권장 개발 도구

```
VS Code + 플러그인:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - MDX
  - GitLens
```

### 로컬 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작 (http://localhost:3000)
pnpm dev

# 빌드
pnpm build

# 프로덕션 미리보기
pnpm start

# 린팅
pnpm lint

# 타입 체크
pnpm type-check
```

### 환경 변수

```bash
# .env.local (개발 환경)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# .env.production (프로덕션)
NEXT_PUBLIC_SITE_URL=https://postgresql-study.kr

# 향후 추가 예정
NEXT_PUBLIC_ALGOLIA_APP_ID=     # 검색 서비스 (선택)
DATABASE_URL=                    # 사용자 데이터 저장 (선택)
```

---

## 배포 환경

### 권장: Vercel

Next.js/Nextra 사이트에 최적화된 배포 플랫폼입니다.

- **무료 플랜**: 개인/오픈소스 프로젝트에 충분
- **자동 배포**: `main` 브랜치 push 시 자동 배포
- **프리뷰 배포**: PR마다 미리보기 URL 생성
- **엣지 네트워크**: 전 세계 CDN 자동 적용
- **분석**: Core Web Vitals 모니터링 기본 제공

### 대안: Cloudflare Pages

- 글로벌 엣지 네트워크
- 무제한 대역폭 (무료 플랜)
- Workers를 통한 서버사이드 기능

### CI/CD 파이프라인

```yaml
# .github/workflows/ci.yml 개요
트리거: PR 생성, main 브랜치 push

단계:
  1. 의존성 설치 (pnpm install)
  2. 타입 체크 (tsc --noEmit)
  3. 린팅 (eslint)
  4. 빌드 테스트 (next build)
  5. E2E 테스트 (playwright) - 향후
  6. 배포 (Vercel/Cloudflare)
```

### 성능 목표

Core Web Vitals 기준:

| 지표 | 목표 | 설명 |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5초 | 주요 콘텐츠 로딩 속도 |
| FID (First Input Delay) | < 100ms | 첫 사용자 입력 응답 |
| CLS (Cumulative Layout Shift) | < 0.1 | 레이아웃 안정성 |
| TTFB (Time to First Byte) | < 600ms | 서버 응답 속도 |

---

## 기술 스택 비교 (문서 프레임워크)

| 항목 | Nextra | Docusaurus | VitePress |
|---|---|---|---|
| 기반 프레임워크 | Next.js (React) | React | Vue |
| MDX 지원 | 네이티브 | 플러그인 | 네이티브 |
| 검색 | FlexSearch 내장 | Algolia/Lunr | 내장 |
| 커스터마이징 | 높음 | 중간 | 중간 |
| 번들 크기 | 중간 | 큼 | 작음 |
| 학습 곡선 | 낮음 (React 기반) | 낮음 | 낮음 (Vue) |
| 한국 사용 레퍼런스 | 많음 | 많음 | 적음 |

**결론**: React/Next.js 생태계를 활용하고, 커스터마이징 유연성을 고려해 Nextra를 우선 검토합니다.

---

## 보안 고려사항

### 정적 사이트 단계

- HTTPS 강제 적용 (Vercel/Cloudflare 기본 제공)
- Content Security Policy (CSP) 헤더 설정
- 의존성 취약점 스캔 (`pnpm audit` 정기 실행)

### 인터랙티브 실습 추가 시

- SQL 인젝션 방지 (샌드박스 환경 격리)
- 쿼리 실행 시간 제한
- 사용자 데이터 최소 수집 원칙

---

## 기술 부채 관리

### 기술 부채 예방 원칙 (토스 스타일)

1. **명확한 TODO 주석**: `@MX:TODO` 태그로 미완성 작업 추적
2. **의존성 최소화**: 반드시 필요한 패키지만 추가
3. **타입 안전성**: `any` 타입 사용 금지, strict 모드 유지
4. **일관된 패턴**: 컴포넌트 작성 방식을 팀 내 표준화

### 정기 검토 항목

- 의존성 업데이트: 월 1회
- Core Web Vitals 점검: 배포마다
- 접근성 감사: 분기 1회

---

최종 수정일: 2026-02-28
문서 버전: 0.1.0 (초기 기획)
결정 필요 사항: 프레임워크 최종 선정, 배포 플랫폼 확정
