const search = document.getElementById("search");

// JSON 파일 로드 및 데이터 처리
const loadCandidateData = async () => {
  try {
    const response = await fetch('../JSON/Daejeon_example.json');
    const jsonData = await response.json();

    // 태그 표시
    displayRealmNames(jsonData);

    // 검색 기능 실행
    search.addEventListener("input", () => filterCandidates(jsonData, search.value.trim()));
  } catch (error) {
    console.error("JSON 데이터를 로드하는 중 문제가 발생했습니다:", error);
  }
};

// 모든 prmsRealmName 모으기
const getAllPrmsRealmNames = (data) => {
  const realmNames = [];
  data.results.forEach(candidate => {
    candidate.promises.forEach(promise => {
      realmNames.push(promise.prmsRealmName);
    });
  });
  return [...new Set(realmNames)]; // 중복 제거
};

// prmsRealmName 표시
const displayRealmNames = (jsonData) => {
  const realmNames = getAllPrmsRealmNames(jsonData);
  const realmNamesContainer = document.getElementById('tags');
  realmNamesContainer.innerHTML = ""; // 기존 태그 초기화

  realmNames.forEach(name => {
    const span = document.createElement('span');
    span.textContent = `#${name}`;
    span.style.cursor = 'pointer';
    span.addEventListener('click', () => {
      // 태그를 클릭하면 검색 필터링 실행
      filterCandidates(jsonData, name);
    });
    realmNamesContainer.appendChild(span);
  });
};

// 검색 필터링 및 결과 표시
const filterCandidates = (jsonData, query) => {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = ""; // 기존 결과 초기화

  if (!query) return; // 검색어가 없으면 종료

  jsonData.results.forEach(candidate => {
    candidate.promises.forEach(promise => {
      if (
        promise.prmsRealmName.includes(query) ||
        promise.prmsTitle.includes(query) ||
        promise.prmsCont.includes(query)
      ) {
        // 결과 요소 생성
        let result_item = document.createElement("div");
        result_item.className = "result-item";

        // 클릭 이벤트 추가
        result_item.addEventListener("click", () => {
          sessionStorage.setItem('selectedCandidateNum', candidate.cnddtId); // candidate.num 저장
          window.location.href = '../Candidate_Main/Candidate_main.html'; // 상세 페이지로 이동
        });

        // 텍스트 내용
        let result_text = document.createElement("div");
        result_text.className = "result-text";

        // 제목
        let result_title = document.createElement("div");
        result_title.className = "result-title";
        result_title.textContent = `${candidate.num}. ${candidate.krName}`;
        result_text.appendChild(result_title);

        // 설명
        let result_description = document.createElement("div");
        result_description.className = "result-description";
        let result_cont = document.createElement("p");
        result_cont.textContent = promise.prmsCont;
        result_description.appendChild(result_cont);
        result_text.appendChild(result_description);

        // 태그
        let result_tags = document.createElement("div");
        result_tags.className = "result-tags";
        let span = document.createElement("span");
        span.textContent = `#${promise.prmsRealmName}`;
        result_tags.appendChild(span);
        result_text.appendChild(result_tags);

        // 썸네일
        let result_thumbnail = document.createElement("div");
        result_thumbnail.className = "result-thumbnail";
        result_thumbnail.innerHTML = `<img src="../Candidate_photo/${candidate.cnddtId}.jpg" alt="${candidate.krName}">`;

        // DOM 연결
        result_item.appendChild(result_text);
        result_item.appendChild(result_thumbnail);
        searchResults.appendChild(result_item);
      }
    });
  });
};

// DOMContentLoaded 이벤트 시 초기화 및 데이터 로드
document.addEventListener("DOMContentLoaded", loadCandidateData);
