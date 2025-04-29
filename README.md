# 목적

- D3라이브러리로 js기반의 데이터 시각화 방식을 이해합니다
- open api와 연동해 캐싱, 요청 간격 조정으로 데이터 요청 최적화 방법을 고민합니다
- 주어진 data를 UI,UX를 고려해 표현하는 방식을 고민합니다

# 미션 구성

1. react + typescript + D3.js
2. [업비트의 시세 캔들 조회 api](https://docs.upbit.com/kr/reference/%EC%B4%88second-%EC%BA%94%EB%93%A4)를 사용해 특정 종목의 초단위 시세를 보여준다

# 미션 요구사항

1. 사용자는 새로 업데이트된 시세의 상승/하락을 색으로 확인할 수 있어야 합니다.
2. 사용자는 페이지 새로고침 없이 데이터를 업데이트받아서 볼 수 있어야합니다.
3. [추가] 사용자는 종목을 검색해 시세 종목을 선택할 수 있습니다

---

- 미션 개시 : 4/28(월)
- 미션 제출 : 5/2(금)
- 미션 제출 방식 : 미션에 맞게 구현 후 pr 올리기

# 계획서

## 라이브러리 및 프레임워크

- TailwindCSS: UI 스타일링
- React Query: 데이터 페칭, 서버 상태 관리
- react-router-dom: 라우팅
- D3: 데이터 시각화
- Jest, Testing Library : 테스팅

## 투두리스트

- API 연동

  - 업비트 OpenAPI 연동
  - 웹소켓으로 기본 시세 데이터 가져오기

- 기본 UI 구축

  - 초봉 캔들 차트 시각화
  - 종목 검색

- 실시간 데이터 처리

  - React Query refetchInterval로 polling 구현
  - 이전 시세 대비 상승/하락 색상 구분 로직 구현

- 최적화 고민하기

  - 데이터 캐싱 설정 (staleTime, cacheTime)
  - 요청 부하 줄이기 (refetchInterval 조정=20초)

- 테스트 코드 작성
  - 주요 컴포넌트 렌더링 테스트
  - 종목 검색 기능 테스트
  - API 응답 mocking 테스트
